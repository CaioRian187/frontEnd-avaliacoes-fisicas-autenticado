import { logError } from "../utils/logger";
import axios from "axios";
import { http } from "./http";
import type { RelatorioPdfParams } from "../interfaces/Relatorio";

export const gerarRelatorioPdf = async (params: RelatorioPdfParams): Promise<Blob> => {
    try {
        const endpoint = params.tipo === "unica"
            ? `/api/relatorios/aluno/${encodeURIComponent(params.alunoId)}/pdf`
            : `/api/relatorios/aluno/${encodeURIComponent(params.alunoId)}/pdf-comparativo`;

        const queryParams = params.tipo === "unica"
            ? { data: params.dataInicial }
            : { data1: params.dataInicial, data2: params.dataFinal };

        const response = await http.get<Blob>(endpoint, {
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
