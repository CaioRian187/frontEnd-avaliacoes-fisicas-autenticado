import { logError } from "../utils/logger";
import axios from "axios";
import type { RelatorioPdfParams } from "../interfaces/Relatorio";

const API_URL = import.meta.env.VITE_URL_API;

// Monta o header de autorizacao padrao usado em todos os endpoints de relatorios.
const buildAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const gerarRelatorioPdf = async (params: RelatorioPdfParams): Promise<Blob> => {
    try {
        const endpoint = params.tipo === "unica"
            ? `${API_URL}/api/relatorios/aluno/${params.alunoId}/pdf`
            : `${API_URL}/api/relatorios/aluno/${params.alunoId}/pdf-comparativo`;

        // O back-end usa nomes diferentes conforme o endpoint:
        // Avaliação Única -> data | Comparativo -> data1 e data2.
        const queryParams = params.tipo === "unica"
            ? { data: params.dataInicial }
            : { data1: params.dataInicial, data2: params.dataFinal };

        const response = await axios.get<Blob>(endpoint, {
            ...buildAuthHeaders(),
            params: queryParams,
            responseType: "blob",
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            logError("Erro ao gerar relatório em PDF: ", {
                status: error.response?.status,
                url: error.config?.url,
                params: error.config?.params,
            });
        } else {
            logError("Erro ao gerar relatório em PDF: ", error);
        }

        throw error;
    }
};
