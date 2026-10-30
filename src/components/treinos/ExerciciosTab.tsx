import { useCallback, useEffect, useState } from "react";
import { useFeedbackModal } from "../../hooks/useFeedback";
import { GRUPO_MUSCULAR_LABELS, type Exercicio } from "../../interfaces/Exercicio";
import { deleteExercicio, findAllExercicios } from "../../services/ExercicioService";
import { extrairMensagemErro } from "../../utils/ErrorUtils";
import { getYouTubeEmbedUrl } from "../../utils/YouTube";
import { ModalDelete } from "../ModalDelete";
import { ExercicioFormModal } from "./ExercicioFormModal";

export const ExerciciosTab = () => {

    const { showSuccess, showError } = useFeedbackModal();
    const [exercicios, setExercicios] = useState<Exercicio[]>([]);
    const [carregando, setCarregando] = useState<boolean>(true);
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    const [exercicioEmEdicao, setExercicioEmEdicao] = useState<Exercicio | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
    const [exercicioParaDeletar, setExercicioParaDeletar] = useState<Exercicio | null>(null);

    const carregarExercicios = useCallback(async () => {
        setCarregando(true);

        try {
            const lista = await findAllExercicios();
            setExercicios(lista);
        } catch (error) {
            console.error("Erro ao carregar catálogo de exercícios: ", error);
            showError(extrairMensagemErro(error, "Não foi possível carregar o catálogo de exercícios."));
        } finally {
            setCarregando(false);
        }
    }, [showError]);

    useEffect(() => {
        carregarExercicios();
    }, [carregarExercicios]);

    const handleNovoExercicio = () => {
        setExercicioEmEdicao(null);
        setIsFormOpen(true);
    };

    const handleEditarExercicio = (exercicio: Exercicio) => {
        setExercicioEmEdicao(exercicio);
        setIsFormOpen(true);
    };

    const handleExercicioSalvo = (exercicio: Exercicio) => {
        setExercicios((anterior) => {
            const existe = anterior.some((item) => item.id === exercicio.id);

            return existe
                ? anterior.map((item) => (item.id === exercicio.id ? exercicio : item))
                : [...anterior, exercicio];
        });
    };

    const handleSolicitarExclusao = (exercicio: Exercicio) => {
        setExercicioParaDeletar(exercicio);
        setIsDeleteOpen(true);
    };

    const confirmarExclusao = async () => {
        if (!exercicioParaDeletar) return;

        try {
            await deleteExercicio(exercicioParaDeletar.id);
            setExercicios((anterior) => anterior.filter((item) => item.id !== exercicioParaDeletar.id));
            setIsDeleteOpen(false);
            setExercicioParaDeletar(null);
            showSuccess("Exercício excluído do catálogo.");
        } catch (error) {
            console.error("Erro ao excluir exercício: ", error);
            showError(
                extrairMensagemErro(
                    error,
                    "Não foi possível excluir o exercício. Ele pode estar vinculado a um treino."
                )
            );
        }
    };

    return (
        <div className="w-full">
            <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-md sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-bold text-gray-800">Catálogo global de exercícios</h2>
                    <p className="text-sm text-gray-500">
                        {exercicios.length} exercício{exercicios.length === 1 ? "" : "s"} cadastrado{exercicios.length === 1 ? "" : "s"}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleNovoExercicio}
                    className="w-full rounded-xl bg-blue-700 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-blue-600 sm:w-auto"
                >
                    Novo Exercício
                </button>
            </div>

            {carregando ? (
                <div className="mt-4 w-full rounded-2xl bg-white p-8 text-center text-gray-500 shadow-md">
                    Carregando exercícios...
                </div>
            ) : exercicios.length === 0 ? (
                <div className="mt-4 w-full rounded-2xl bg-white p-8 text-center text-gray-500 shadow-md">
                    Nenhum exercício cadastrado. Clique em "Novo Exercício" para começar.
                </div>
            ) : (
                <div className="mt-4 grid grid-cols-1 gap-4">
                    {exercicios.map((exercicio) => {
                        const embedUrl = getYouTubeEmbedUrl(exercicio.urlVideo);

                        return (
                            <div
                                key={exercicio.id}
                                className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-md md:flex-row"
                            >
                                <div className="w-full shrink-0 overflow-hidden rounded-xl bg-gray-900 md:w-80">
                                    {embedUrl ? (
                                        <div className="aspect-video w-full">
                                            <iframe
                                                src={embedUrl}
                                                title={exercicio.nome}
                                                loading="lazy"
                                                className="h-full w-full"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                allowFullScreen
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex aspect-video w-full items-center justify-center text-sm text-gray-300">
                                            Vídeo indisponível
                                        </div>
                                    )}
                                </div>

                                <div className="flex min-w-0 flex-1 flex-col gap-3">
                                    <div className="flex flex-wrap items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <h3 className="truncate text-lg font-bold text-gray-800">{exercicio.nome}</h3>
                                            <span className="mt-1 inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                                                {GRUPO_MUSCULAR_LABELS[exercicio.grupoMuscular]}
                                            </span>
                                        </div>

                                        <div className="flex shrink-0 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleEditarExercicio(exercicio)}
                                                className="rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-600"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleSolicitarExclusao(exercicio)}
                                                className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-600"
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-600">{exercicio.descricao}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <ExercicioFormModal
                isOpen={isFormOpen}
                exercicio={exercicioEmEdicao}
                onClose={() => setIsFormOpen(false)}
                onSaved={handleExercicioSalvo}
            />

            {isDeleteOpen && exercicioParaDeletar && (
                <ModalDelete
                    setIsOpenModalDelete={setIsDeleteOpen}
                    msg={`Deseja realmente excluir o exercício "${exercicioParaDeletar.nome}" do catálogo?`}
                    onClickSim={confirmarExclusao}
                />
            )}
        </div>
    );
};
