import axios from "axios";

// Extrai a mensagem devolvida pela API, evitando exibir uma mensagem generica quando
// o back-end bloqueia a operacao (ex: aluno com circunferencias/dobras vinculadas).
export const extrairMensagemErro = (error: unknown, fallback: string): string => {
    if (axios.isAxiosError(error) && error.response?.data) {
        const data = error.response.data as Record<string, unknown> | string;

        if (typeof data === "string") return data;

        const mensagens = Object.values(data).filter(
            (valor): valor is string => typeof valor === "string"
        );

        if (mensagens.length > 0) return mensagens.join(" ");
    }

    if (error instanceof Error && error.message) return error.message;

    return fallback;
};
