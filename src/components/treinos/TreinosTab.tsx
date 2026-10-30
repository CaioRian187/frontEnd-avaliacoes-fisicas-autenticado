import { logError } from "../../utils/logger";
import { useCallback, useEffect, useState } from "react";
import { useFeedbackModal } from "../../hooks/useFeedback";
import { GRUPO_MUSCULAR_LABELS, type Exercicio } from "../../interfaces/Exercicio";
import {
    DIA_SEMANA_ABREVIADO,
    DIA_SEMANA_LABELS,
    DIAS_SEMANA,
    getDiaSemanaAtual,
    type DiaSemana,
    type ExercicioTreinoDraft,
    type Treino,
    type TreinoExercicioRequest,
    type TreinoRequest,
} from "../../interfaces/Treino";
import type { Usuario } from "../../interfaces/Usuario";
import { findAllExercicios } from "../../services/ExercicioService";
import { createTreino, deleteTreino, findAllTreinosByAlunoId, findMeusTreinos } from "../../services/TreinoService";
import { findAllUsuariosProjetions } from "../../services/UsuarioService";
import { extrairMensagemErro } from "../../utils/ErrorUtils";
import { ModalDelete } from "../ModalDelete";
import { ExercicioTreinoCard } from "./ExercicioTreinoCard";
import { VideoModal } from "./VideoModal";

interface TreinosTabProps {
    isAdmin: boolean;
}

interface AlunoOption {
    id: string;
    nome: string;
}

interface VideoSelecionado {
    url: string;
    titulo: string;
}

const criarExercicioFallback = (item: Treino["exercicios"][number]): Exercicio => ({
    id: item.exercicioId,
    nome: item.nomeExercicio,
    descricao: "",
    grupoMuscular: item.grupoMuscular,
    urlVideo: "",
});

const mapearDraftsDoTreino = (treino: Treino, catalogo: Exercicio[]): ExercicioTreinoDraft[] =>
    treino.exercicios.map((item) => {
        const exercicio = catalogo.find((catalogoItem) => catalogoItem.id === item.exercicioId);

        return {
            exercicio: exercicio ?? criarExercicioFallback(item),
            quantidadeSeries: String(item.quantidadeSeries),
            quantidadeRepeticoes: String(item.quantidadeRepeticoes),
            carga: item.carga ?? "",
            tempoDescanso: item.tempoDescanso != null ? String(item.tempoDescanso) : "",
        };
    });

export const TreinosTab = ({ isAdmin }: TreinosTabProps) => {

    const { showSuccess, showWarning, showError } = useFeedbackModal();
    const [alunos, setAlunos] = useState<AlunoOption[]>([]);
    const [alunoId, setAlunoId] = useState<string>("");
    const [diaSemana, setDiaSemana] = useState<DiaSemana>(getDiaSemanaAtual());
    const [catalogo, setCatalogo] = useState<Exercicio[]>([]);
    const [treinoDoDia, setTreinoDoDia] = useState<Treino | null>(null);
    const [nomeTreino, setNomeTreino] = useState<string>("");
    const [observacoes, setObservacoes] = useState<string>("");
    const [drafts, setDrafts] = useState<ExercicioTreinoDraft[]>([]);
    const [exercicioSelecionadoId, setExercicioSelecionadoId] = useState<string>("");
    const [series, setSeries] = useState<string>("3");
    const [repeticoes, setRepeticoes] = useState<string>("12");
    const [carga, setCarga] = useState<string>("");
    const [tempoDescanso, setTempoDescanso] = useState<string>("60");
    const [carregando, setCarregando] = useState<boolean>(false);
    const [salvando, setSalvando] = useState<boolean>(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
    const [videoSelecionado, setVideoSelecionado] = useState<VideoSelecionado | null>(null);

    useEffect(() => {
        let ativo = true;

        findAllExercicios()
            .then((lista) => {
                if (ativo) setCatalogo(lista);
            })
            .catch((error: unknown) => {
                logError("Erro ao carregar catálogo de exercícios: ", error);
                showError(extrairMensagemErro(error, "Não foi possível carregar o catálogo de exercícios."));
            });

        return () => {
            ativo = false;
        };
    }, [showError]);

    useEffect(() => {
        if (!isAdmin) return;

        let ativo = true;

        findAllUsuariosProjetions()
            .then((usuarios: Usuario[]) => {
                if (!ativo) return;

                setAlunos(
                    usuarios
                        .filter((usuario) => Boolean(usuario.id))
                        .map((usuario) => ({
                            id: usuario.id ?? "",
                            nome: usuario.nome ?? "Aluno sem nome",
                        }))
                );
            })
            .catch((error: unknown) => {
                logError("Erro ao carregar alunos: ", error);
                showError("Não foi possível carregar a lista de alunos.");
            });

        return () => {
            ativo = false;
        };
    }, [isAdmin, showError]);

    const carregarTreinoDoDia = useCallback(async () => {
        if (isAdmin && !alunoId) {
            setTreinoDoDia(null);
            return;
        }

        setCarregando(true);

        try {
            const lista = isAdmin
                ? await findAllTreinosByAlunoId(alunoId, diaSemana)
                : await findMeusTreinos(diaSemana);

            setTreinoDoDia(lista[0] ?? null);
        } catch (error) {
            logError("Erro ao carregar treino do dia: ", error);
            showError(extrairMensagemErro(error, "Não foi possível carregar o treino do dia selecionado."));
        } finally {
            setCarregando(false);
        }
    }, [alunoId, diaSemana, isAdmin, showError]);

    useEffect(() => {
        carregarTreinoDoDia();
    }, [carregarTreinoDoDia]);

    useEffect(() => {
        if (!treinoDoDia) {
            setNomeTreino("");
            setObservacoes("");
            setDrafts([]);
            return;
        }

        setNomeTreino(treinoDoDia.nomeTreino);
        setObservacoes(treinoDoDia.observacoes ?? "");
        setDrafts(mapearDraftsDoTreino(treinoDoDia, catalogo));
    }, [treinoDoDia, catalogo]);

    const alunoSelecionado = alunos.find((aluno) => aluno.id === alunoId);
    const exerciciosDisponiveis = catalogo.filter(
        (exercicio) => !drafts.some((draft) => draft.exercicio.id === exercicio.id)
    );

    const adicionarExercicio = () => {
        if (!exercicioSelecionadoId) {
            showWarning("Selecione um exercício do catálogo.");
            return;
        }

        const exercicio = catalogo.find((item) => item.id === exercicioSelecionadoId);

        if (!exercicio) {
            showWarning("Exercício não encontrado no catálogo.");
            return;
        }

        if (drafts.some((draft) => draft.exercicio.id === exercicio.id)) {
            showWarning("Esse exercício já foi adicionado ao treino.");
            return;
        }

        const seriesNumero = Number(series);
        const repeticoesNumero = Number(repeticoes);
        const descansoNumero = Number(tempoDescanso);

        if (!Number.isInteger(seriesNumero) || seriesNumero < 1) {
            showWarning("Informe uma quantidade de séries válida.");
            return;
        }

        if (!Number.isInteger(repeticoesNumero) || repeticoesNumero < 1) {
            showWarning("Informe uma quantidade de repetições válida.");
            return;
        }

        if (tempoDescanso.trim() === "" || !Number.isInteger(descansoNumero) || descansoNumero < 0) {
            showWarning("Informe um tempo de descanso válido em segundos.");
            return;
        }

        setDrafts((anterior) => [
            ...anterior,
            {
                exercicio,
                quantidadeSeries: String(seriesNumero),
                quantidadeRepeticoes: String(repeticoesNumero),
                carga: carga.trim(),
                tempoDescanso: String(descansoNumero),
            },
        ]);

        setExercicioSelecionadoId("");
        setSeries("3");
        setRepeticoes("12");
        setCarga("");
        setTempoDescanso("60");
    };

    const removerExercicio = (exercicioId: string) => {
        setDrafts((anterior) => anterior.filter((draft) => draft.exercicio.id !== exercicioId));
    };

    const atualizarDraft = (draftAtualizado: ExercicioTreinoDraft) => {
        setDrafts((anterior) =>
            anterior.map((draft) =>
                draft.exercicio.id === draftAtualizado.exercicio.id ? draftAtualizado : draft
            )
        );
    };

    const salvarTreino = async () => {
        if (!isAdmin) return;

        if (!alunoId) {
            showError("Selecione um aluno antes de salvar o treino.");
            return;
        }

        if (!nomeTreino.trim()) {
            showWarning("Informe o nome do treino.");
            return;
        }

        if (!observacoes.trim()) {
            showWarning("Informe as observações do treino.");
            return;
        }

        if (drafts.length === 0) {
            showWarning("Adicione pelo menos um exercício ao treino.");
            return;
        }

        const exerciciosRequest: TreinoExercicioRequest[] = [];

        for (const draft of drafts) {
            const seriesNumero = Number(draft.quantidadeSeries);
            const repeticoesNumero = Number(draft.quantidadeRepeticoes);
            const descansoNumero = Number(draft.tempoDescanso);

            if (!Number.isInteger(seriesNumero) || seriesNumero < 1 || !Number.isInteger(repeticoesNumero) || repeticoesNumero < 1) {
                showWarning(`Informe séries e repetições válidas para "${draft.exercicio.nome}".`);
                return;
            }

            if (draft.tempoDescanso.trim() !== "" && (!Number.isInteger(descansoNumero) || descansoNumero < 0)) {
                showWarning(`Informe um tempo de descanso válido para "${draft.exercicio.nome}".`);
                return;
            }

            exerciciosRequest.push({
                exercicioId: draft.exercicio.id,
                quantidadeSeries: seriesNumero,
                quantidadeRepeticoes: repeticoesNumero,
                carga: draft.carga.trim() ? draft.carga.trim() : undefined,
                tempoDescanso: draft.tempoDescanso.trim() !== "" ? descansoNumero : undefined,
            });
        }

        const request: TreinoRequest = {
            nomeTreino: nomeTreino.trim(),
            observacoes: observacoes.trim(),
            diaSemana,
            alunoId,
            exercicios: exerciciosRequest,
        };

        setSalvando(true);

        try {
            await createTreino(request);

            // Não existe endpoint de atualização de treino: criamos o novo e
            // removemos o antigo para manter apenas uma ficha por dia.
            if (treinoDoDia) {
                try {
                    await deleteTreino(treinoDoDia.id);
                } catch (error) {
                    logError("Treino criado, mas não foi possível remover o antigo: ", error);
                    showWarning("Treino salvo, mas não foi possível remover a versão anterior.");
                }
            }

            showSuccess(treinoDoDia ? "Treino atualizado com sucesso!" : "Treino cadastrado com sucesso!");
            await carregarTreinoDoDia();
        } catch (error) {
            logError("Erro ao salvar treino: ", error);
            showError(extrairMensagemErro(error, "Não foi possível salvar o treino."));
        } finally {
            setSalvando(false);
        }
    };

    const confirmarExclusao = async () => {
        if (!treinoDoDia) return;

        try {
            await deleteTreino(treinoDoDia.id);
            setIsDeleteOpen(false);
            showSuccess("Treino excluído com sucesso!");
            await carregarTreinoDoDia();
        } catch (error) {
            logError("Erro ao excluir treino: ", error);
            showError(extrairMensagemErro(error, "Não foi possível excluir o treino."));
        }
    };

    const renderExercicios = (readOnly: boolean) => (
        <div className="flex flex-col gap-3">
            {drafts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500">
                    Nenhum exercício adicionado a este dia.
                </div>
            ) : (
                drafts.map((draft, index) => (
                    <ExercicioTreinoCard
                        key={draft.exercicio.id}
                        draft={draft}
                        numero={index + 1}
                        readOnly={readOnly}
                        onChange={readOnly ? undefined : atualizarDraft}
                        onRemove={readOnly ? undefined : () => removerExercicio(draft.exercicio.id)}
                        onVerVideo={() =>
                            setVideoSelecionado({ url: draft.exercicio.urlVideo, titulo: draft.exercicio.nome })
                        }
                    />
                ))
            )}
        </div>
    );

    return (
        <div className="flex w-full flex-col gap-4">
            {isAdmin && (
                <div className="rounded-2xl bg-white p-4 shadow-md">
                    <div className="flex w-full flex-col gap-1 sm:max-w-md">
                        <label htmlFor="alunoTreino" className="text-sm font-medium text-gray-700">
                            Aluno
                        </label>
                        <select
                            id="alunoTreino"
                            value={alunoId}
                            onChange={(event) => setAlunoId(event.target.value)}
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        >
                            <option value="">Selecione um aluno</option>
                            {alunos.map((aluno) => (
                                <option key={aluno.id} value={aluno.id}>
                                    {aluno.nome}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            <div className="rounded-2xl bg-white p-2 shadow-md">
                <div className="flex gap-1 overflow-x-auto">
                    {DIAS_SEMANA.map((dia) => {
                        const ativo = dia === diaSemana;

                        return (
                            <button
                                key={dia}
                                type="button"
                                onClick={() => setDiaSemana(dia)}
                                title={DIA_SEMANA_LABELS[dia]}
                                className={`flex-1 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                                    ativo
                                        ? "bg-blue-700 text-white"
                                        : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                                }`}
                            >
                                <span className="sm:hidden">{DIA_SEMANA_ABREVIADO[dia]}</span>
                                <span className="hidden sm:inline">{DIA_SEMANA_LABELS[dia]}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {carregando ? (
                <div className="rounded-2xl bg-white p-8 text-center text-gray-500 shadow-md">
                    Carregando treino de {DIA_SEMANA_LABELS[diaSemana].toLowerCase()}...
                </div>
            ) : !isAdmin ? (
                <div className="rounded-2xl bg-white p-4 shadow-md sm:p-6">
                    <div className="mb-4">
                        <h2 className="text-lg font-bold text-gray-800">
                            {treinoDoDia ? treinoDoDia.nomeTreino : `Treino de ${DIA_SEMANA_LABELS[diaSemana].toLowerCase()}`}
                        </h2>
                        {treinoDoDia?.observacoes && (
                            <p className="mt-1 text-sm text-gray-600">{treinoDoDia.observacoes}</p>
                        )}
                        {!treinoDoDia && (
                            <p className="mt-1 text-sm text-gray-500">
                                Nenhum treino cadastrado para este dia.
                            </p>
                        )}
                    </div>

                    {treinoDoDia && renderExercicios(true)}
                </div>
            ) : !alunoId ? (
                <div className="rounded-2xl bg-white p-8 text-center text-gray-500 shadow-md">
                    Selecione um aluno para montar o treino.
                </div>
            ) : (
                <div className="rounded-2xl bg-white p-4 shadow-md sm:p-6">
                    <div className="flex flex-col gap-1 border-b border-gray-200 pb-4">
                        <h2 className="text-lg font-bold text-gray-800">
                            {treinoDoDia ? "Editar treino" : "Novo treino"} • {DIA_SEMANA_LABELS[diaSemana]}
                        </h2>
                        {alunoSelecionado && (
                            <p className="text-sm text-gray-500">Aluno: {alunoSelecionado.nome}</p>
                        )}
                    </div>

                    <div className="mt-4 flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">Nome do treino</label>
                            <input
                                type="text"
                                value={nomeTreino}
                                onChange={(event) => setNomeTreino(event.target.value)}
                                placeholder="Ex: Treino A - Membros Superiores"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">Observações</label>
                            <textarea
                                value={observacoes}
                                onChange={(event) => setObservacoes(event.target.value)}
                                rows={2}
                                placeholder="Orientações gerais, descanso, frequência..."
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                            <h3 className="text-base font-bold text-gray-800">Adicionar exercício</h3>

                            {catalogo.length === 0 ? (
                                <p className="mt-2 text-sm text-gray-500">
                                    Nenhum exercício cadastrado. Cadastre-os na aba "Exercícios".
                                </p>
                            ) : (
                                <>
                                    <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                                        <div className="flex flex-col gap-1 md:col-span-2">
                                            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                Exercício do catálogo
                                            </label>
                                            <select
                                                value={exercicioSelecionadoId}
                                                onChange={(event) => setExercicioSelecionadoId(event.target.value)}
                                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                            >
                                                <option value="">Selecione um exercício</option>
                                                {exerciciosDisponiveis.map((exercicio) => (
                                                    <option key={exercicio.id} value={exercicio.id}>
                                                        {exercicio.nome} — {GRUPO_MUSCULAR_LABELS[exercicio.grupoMuscular]}
                                                    </option>
                                                ))}
                                            </select>
                                            {exerciciosDisponiveis.length === 0 && (
                                                <p className="text-xs text-gray-500">
                                                    Todos os exercícios do catálogo já estão neste treino.
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                Séries
                                            </label>
                                            <input
                                                type="number"
                                                min={1}
                                                value={series}
                                                onChange={(event) => setSeries(event.target.value)}
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                Repetições
                                            </label>
                                            <input
                                                type="number"
                                                min={1}
                                                value={repeticoes}
                                                onChange={(event) => setRepeticoes(event.target.value)}
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                Carga
                                            </label>
                                            <input
                                                type="text"
                                                value={carga}
                                                onChange={(event) => setCarga(event.target.value)}
                                                placeholder="Ex: 20 kg"
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                Descanso (segundos)
                                            </label>
                                            <input
                                                type="number"
                                                min={0}
                                                value={tempoDescanso}
                                                onChange={(event) => setTempoDescanso(event.target.value)}
                                                placeholder="Ex: 60"
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                            />
                                        </div>

                                        <div className="flex items-end md:col-span-2">
                                            <button
                                                type="button"
                                                onClick={adicionarExercicio}
                                                className="w-full rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
                                            >
                                                Adicionar ao Treino
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div>
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="text-base font-bold text-gray-800">Exercícios do treino</h3>
                                <span className="text-sm text-gray-500">
                                    {drafts.length} exercício{drafts.length === 1 ? "" : "s"}
                                </span>
                            </div>

                            {renderExercicios(false)}
                        </div>

                        <div className="flex flex-col gap-2 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end">
                            {treinoDoDia && (
                                <button
                                    type="button"
                                    onClick={() => setIsDeleteOpen(true)}
                                    disabled={salvando}
                                    className="w-full rounded-xl bg-red-500 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                                >
                                    Excluir treino do dia
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={salvarTreino}
                                disabled={salvando}
                                className="w-full rounded-xl bg-blue-700 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                            >
                                {salvando ? "Salvando..." : "Salvar Treino"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isDeleteOpen && treinoDoDia && (
                <ModalDelete
                    setIsOpenModalDelete={setIsDeleteOpen}
                    msg={`Deseja realmente excluir o treino de ${DIA_SEMANA_LABELS[diaSemana].toLowerCase()}?`}
                    onClickSim={confirmarExclusao}
                />
            )}

            {videoSelecionado && (
                <VideoModal
                    url={videoSelecionado.url}
                    titulo={videoSelecionado.titulo}
                    onClose={() => setVideoSelecionado(null)}
                />
            )}
        </div>
    );
};
