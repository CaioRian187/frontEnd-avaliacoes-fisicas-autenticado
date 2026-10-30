import { logError } from "../utils/logger";
import axios from "axios";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { BotaoVoltar } from "../components/BotaoVoltar";
import { PdfViewerModal } from "../components/PdfViewerModal";
import { useFeedbackModal } from "../hooks/useFeedback";
import type { TipoRelatorio } from "../interfaces/Relatorio";
import { findAllCircunferenciasByAlunoId } from "../services/CircunferenciaService";
import { findAllDobrasByAlunoId } from "../services/DobraService";
import { findAllUsuariosProjetions, findUsuarioById } from "../services/UsuarioService";
import { gerarRelatorioPdf } from "../services/RelatorioService";
import { getTokenDecoded } from "../utils/Auth";
import { converterData } from "../utils/ConverterData";
import { extrairMensagemErro } from "../utils/ErrorUtils";

interface AlunoOption {
    id: string;
    nome: string;
}

// Mantem apenas a parte YYYY-MM-DD, formato esperado pela API de relatorios.
const normalizarData = (data?: string): string => (data ? data.slice(0, 10) : "");

const ordenarDatas = (datas: Iterable<string>): string[] =>
    Array.from(new Set(datas)).sort((a, b) => b.localeCompare(a));

// Extrai apenas as datas validas dos registros retornados pela API.
const extrairDatas = (registros: Array<{ data?: string }>): string[] =>
    registros
        .map((registro) => normalizarData(registro.data))
        .filter((data) => data.length > 0);

// Remove acentos e caracteres invalidos para montar o nome do arquivo baixado.
const formatarNomeArquivo = (nome: string): string => {
    const normalizado = nome
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[\\/:*?"<>|]/g, "")
        .trim()
        .replace(/\s+/g, "_");

    return normalizado || "aluno";
};

// A API responde erros como Blob quando responseType = "blob"; tentamos extrair a mensagem real.
const obterMensagemErro = async (error: unknown): Promise<string> => {
    const status = axios.isAxiosError(error) ? error.response?.status : undefined;

    if (axios.isAxiosError(error) && error.response?.data instanceof Blob) {
        try {
            const texto = await error.response.data.text();
            const dados = JSON.parse(texto) as Record<string, unknown>;
            const mensagens = Object.values(dados).filter(
                (valor): valor is string => typeof valor === "string"
            );

            if (mensagens.length > 0) {
                return status ? `${mensagens.join(" ")} (HTTP ${status})` : mensagens.join(" ");
            }
        } catch {
            // Mantem o fallback quando o corpo do erro nao for um JSON valido.
        }
    }

    const mensagem = extrairMensagemErro(error, "Não foi possível gerar o relatório. Tente novamente.");
    return status ? `${mensagem} (HTTP ${status})` : mensagem;
};

export const EstatisticasPage = () => {

    const { showError, showWarning, showSuccess } = useFeedbackModal();
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [alunos, setAlunos] = useState<AlunoOption[]>([]);
    const [alunoId, setAlunoId] = useState<string>("");
    const [alunoNome, setAlunoNome] = useState<string>("");
    const [tipoRelatorio, setTipoRelatorio] = useState<TipoRelatorio>("unica");
    const [dataInicial, setDataInicial] = useState<string>("");
    const [dataFinal, setDataFinal] = useState<string>("");
    const [datasDobras, setDatasDobras] = useState<string[]>([]);
    const [datasCircunferencias, setDatasCircunferencias] = useState<string[]>([]);
    const [carregandoDatas, setCarregandoDatas] = useState<boolean>(false);
    const [carregando, setCarregando] = useState<boolean>(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [nomeArquivo, setNomeArquivo] = useState<string>("");

    const pdfUrlRef = useRef<string | null>(null);

    // Libera a URL de objeto ao desmontar a pagina.
    useEffect(() => {
        return () => {
            if (pdfUrlRef.current) {
                URL.revokeObjectURL(pdfUrlRef.current);
                pdfUrlRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        const tokenDecoded = getTokenDecoded();

        if (!tokenDecoded?.id) {
            showError("Não foi possível identificar o usuário logado.");
            return;
        }

        if (tokenDecoded.role === "ADMIN") {
            setIsAdmin(true);

            findAllUsuariosProjetions()
                .then((usuarios) => {
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

            return;
        }

        setAlunoId(tokenDecoded.id);
        setIsAdmin(false);

        findUsuarioById(tokenDecoded.id)
            .then((usuario) => setAlunoNome(usuario.nome ?? "Aluno"))
            .catch((error: unknown) => {
                logError("Erro ao carregar os dados do usuário: ", error);
                setAlunoNome("Aluno");
            });
    }, [showError]);

    // Carrega as datas das avaliacoes (dobras e circunferencias) do aluno selecionado.
    useEffect(() => {
        if (!alunoId) {
            setDatasDobras([]);
            setDatasCircunferencias([]);
            setDataInicial("");
            setDataFinal("");
            setCarregandoDatas(false);
            return;
        }

        let cancelado = false;

        setCarregandoDatas(true);
        setDataInicial("");
        setDataFinal("");

        Promise.allSettled([
            findAllDobrasByAlunoId(alunoId),
            findAllCircunferenciasByAlunoId(alunoId),
        ])
            .then(([dobras, circunferencias]) => {
                if (cancelado) return;

                setDatasDobras(
                    dobras.status === "fulfilled" ? ordenarDatas(extrairDatas(dobras.value)) : []
                );
                setDatasCircunferencias(
                    circunferencias.status === "fulfilled"
                        ? ordenarDatas(extrairDatas(circunferencias.value))
                        : []
                );

                if (dobras.status === "rejected" || circunferencias.status === "rejected") {
                    logError("Erro ao carregar as datas das avaliações: ", {
                        dobras: dobras.status === "rejected" ? dobras.reason : undefined,
                        circunferencias:
                            circunferencias.status === "rejected" ? circunferencias.reason : undefined,
                    });
                }
            })
            .finally(() => {
                if (!cancelado) {
                    setCarregandoDatas(false);
                }
            });

        return () => {
            cancelado = true;
        };
    }, [alunoId]);

    const datasDisponiveis = useMemo(
        () => ordenarDatas([...datasDobras, ...datasCircunferencias]),
        [datasDobras, datasCircunferencias]
    );

    // No comparativo, a data final so pode ser igual ou posterior a data inicial.
    const datasFinaisDisponiveis = useMemo(
        () => datasDisponiveis.filter((data) => !dataInicial || data >= dataInicial),
        [datasDisponiveis, dataInicial]
    );

    const fecharPreVisualizacao = () => {
        if (pdfUrlRef.current) {
            URL.revokeObjectURL(pdfUrlRef.current);
            pdfUrlRef.current = null;
        }

        setPdfUrl(null);
    };

    const handleSelecionarAluno = (id: string) => {
        setAlunoId(id);

        const alunoSelecionado = alunos.find((aluno) => aluno.id === id);
        setAlunoNome(alunoSelecionado?.nome ?? "");
    };

    const handleAlterarTipoRelatorio = (tipo: TipoRelatorio) => {
        setTipoRelatorio(tipo);

        if (tipo === "unica") {
            setDataFinal("");
        }
    };

    const handleAlterarDataInicial = (data: string) => {
        setDataInicial(data);

        if (dataFinal && dataFinal < data) {
            setDataFinal("");
        }
    };

    const textoPlaceholderData = (() => {
        if (!alunoId) return "Selecione um aluno primeiro";
        if (carregandoDatas) return "Carregando avaliações...";
        if (datasDisponiveis.length === 0) return "Nenhuma avaliação encontrada para este aluno";
        return tipoRelatorio === "unica"
            ? "Selecione a data da avaliação"
            : "Selecione a data inicial";
    })();

    const handleGerarRelatorio = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!alunoId) {
            showError(isAdmin
                ? "Selecione um aluno para gerar o relatório."
                : "Não foi possível identificar o usuário logado.");
            return;
        }

        if (!dataInicial) {
            showError("Selecione a data da avaliação.");
            return;
        }

        if (tipoRelatorio === "comparativo" && !dataFinal) {
            showError("Selecione a data final do comparativo.");
            return;
        }

        if (tipoRelatorio === "comparativo" && dataFinal < dataInicial) {
            showWarning("A data final deve ser igual ou posterior à data inicial.");
            return;
        }

        setCarregando(true);

        try {
            const blob = await gerarRelatorioPdf({
                alunoId,
                tipo: tipoRelatorio,
                dataInicial,
                dataFinal: tipoRelatorio === "comparativo" ? dataFinal : undefined,
            });

            if (blob.size === 0) {
                showError("A API retornou um arquivo vazio. Verifique os dados selecionados.");
                return;
            }

            const nomeAluno = formatarNomeArquivo(alunoNome || "aluno");
            const periodo = tipoRelatorio === "unica"
                ? dataInicial
                : `${dataInicial}_a_${dataFinal}`;

            fecharPreVisualizacao();

            const url = URL.createObjectURL(blob);
            pdfUrlRef.current = url;
            setNomeArquivo(`Relatorio_${nomeAluno}_${periodo}.pdf`);
            setPdfUrl(url);
        } catch (error) {
            logError("Erro ao gerar relatório: ", error);
            showError(await obterMensagemErro(error));
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="mt-2 flex flex-col items-center w-full py-6">
            <BotaoVoltar />
            <h1 className="mb-4 text-2xl text-gray-800 font-semibold">Estatísticas</h1>

            <div className="w-full max-w-6xl xl:max-w-7xl flex flex-col gap-4">
                <div className="w-full bg-white shadow-md rounded-2xl p-4 md:p-8">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">Emissão de relatórios</h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Selecione o tipo de relatório e o período desejado para visualizar o PDF antes de imprimir ou baixar.
                        </p>
                    </div>

                    {!isAdmin && (
                        <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                            Você está emitindo relatórios referentes aos seus próprios dados
                            {alunoNome ? `, ${alunoNome}` : ""}.
                        </div>
                    )}

                    <form onSubmit={handleGerarRelatorio} className="flex flex-col gap-6">
                        {isAdmin && (
                            <div className="flex flex-col gap-1">
                                <label htmlFor="aluno" className="text-md font-medium text-gray-700">
                                    Aluno
                                </label>
                                <select
                                    id="aluno"
                                    value={alunoId}
                                    onChange={(event) => handleSelecionarAluno(event.target.value)}
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
                        )}

                        <div className="flex flex-col gap-1">
                            <label htmlFor="tipoRelatorio" className="text-md font-medium text-gray-700">
                                Tipo de relatório
                            </label>
                            <select
                                id="tipoRelatorio"
                                value={tipoRelatorio}
                                onChange={(event) => handleAlterarTipoRelatorio(event.target.value as TipoRelatorio)}
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            >
                                <option value="unica">Relatório de Avaliação Única</option>
                                <option value="comparativo">Relatório Comparativo</option>
                            </select>
                        </div>

                        <div className={`grid gap-4 ${tipoRelatorio === "comparativo" ? "md:grid-cols-2" : "md:max-w-md"}`}>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="dataInicial" className="text-md font-medium text-gray-700">
                                    {tipoRelatorio === "unica" ? "Data da avaliação" : "Data inicial"}
                                </label>
                                <select
                                    id="dataInicial"
                                    value={dataInicial}
                                    onChange={(event) => handleAlterarDataInicial(event.target.value)}
                                    disabled={!alunoId || carregandoDatas || datasDisponiveis.length === 0}
                                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                                >
                                    <option value="">{textoPlaceholderData}</option>
                                    {datasDisponiveis.map((data) => (
                                        <option key={data} value={data}>
                                            {converterData(data)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {tipoRelatorio === "comparativo" && (
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="dataFinal" className="text-md font-medium text-gray-700">
                                        Data final
                                    </label>
                                    <select
                                        id="dataFinal"
                                        value={dataFinal}
                                        onChange={(event) => setDataFinal(event.target.value)}
                                        disabled={!alunoId || carregandoDatas || datasFinaisDisponiveis.length === 0}
                                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                                    >
                                        <option value="">
                                            {!alunoId
                                                ? "Selecione um aluno primeiro"
                                                : carregandoDatas
                                                    ? "Carregando avaliações..."
                                                    : datasFinaisDisponiveis.length === 0
                                                        ? "Nenhuma avaliação posterior à data inicial"
                                                        : "Selecione a data final"}
                                        </option>
                                        {datasFinaisDisponiveis.map((data) => (
                                            <option key={data} value={data}>
                                                {converterData(data)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={carregando}
                            className="w-full rounded-md bg-blue-700 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {carregando ? "Gerando relatório..." : "Gerar Relatório"}
                        </button>
                    </form>
                </div>
            </div>

            {pdfUrl && (
                <PdfViewerModal
                    pdfUrl={pdfUrl}
                    nomeArquivo={nomeArquivo}
                    onClose={fecharPreVisualizacao}
                    onDownload={() => showSuccess("Download do relatório iniciado.")}
                />
            )}
        </div>
    );
};
