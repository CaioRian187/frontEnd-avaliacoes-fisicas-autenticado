import axios from "axios";

const LIMITE_MENSAGEM = 300;

const sanitizarMensagem = (mensagem: string): string => {
    return Array.from(mensagem)
        .filter((caractere) => {
            const codigo = caractere.charCodeAt(0);
            return codigo >= 32 && codigo !== 127;
        })
        .join("")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, LIMITE_MENSAGEM);
};

export const extrairMensagemErro = (error: unknown, fallback: string): string => {
    if (axios.isAxiosError(error) && error.response?.data) {
        const data = error.response.data as Record<string, unknown> | string;

        if (typeof data === "string") {
            const mensagem = sanitizarMensagem(data);
            return mensagem || fallback;
        }

        const mensagens = Object.values(data)
            .filter((valor): valor is string => typeof valor === "string")
            .map(sanitizarMensagem)
            .filter(Boolean);

        if (mensagens.length > 0) {
            return sanitizarMensagem(mensagens.join(" "));
        }
    }

    return fallback;
};
