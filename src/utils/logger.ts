import axios from "axios";

// Descreve o erro sem incluir corpo, headers, URL ou parametros da requisicao.
// Esses campos podem carregar credenciais, token Bearer e dados sensiveis.
const descreverErro = (erro: unknown): string => {
    if (axios.isAxiosError(erro)) {
        const status = erro.response?.status;
        return status
            ? `HTTP ${status} (${erro.code ?? "erro"})`
            : `rede (${erro.code ?? "sem resposta"})`;
    }

    if (erro instanceof Error) {
        return `${erro.name}: ${erro.message}`;
    }

    return "erro desconhecido";
};

// Centraliza o log de erros para que nenhum objeto de erro bruto chegue ao console.
export const logError = (contextoOuErro: unknown, erro?: unknown): void => {
    if (import.meta.env.PROD) return;

    if (erro === undefined) {
        console.error(descreverErro(contextoOuErro));
        return;
    }

    const contexto = typeof contextoOuErro === "string" ? contextoOuErro.trim() : "Erro";

    console.error(`${contexto} ${descreverErro(erro)}`);
};
