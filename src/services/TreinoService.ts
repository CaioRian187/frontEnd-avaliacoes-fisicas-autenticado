import { logError } from "../utils/logger";
import { http } from "./http";
import type { DiaSemana, Treino, TreinoRequest } from "../interfaces/Treino";

export const createTreino = async (treino: TreinoRequest): Promise<Treino> => {
    try {
        const response = await http.post<Treino>("/api/treinos", treino);
        return response.data;
    } catch (error) {
        logError("Erro ao cadastrar treino: ", error);
        throw error;
    }
};

export const findAllTreinosByAlunoId = async (alunoId: string, diaSemana?: DiaSemana): Promise<Treino[]> => {
    try {
        const response = await http.get<Treino[]>(
            `/api/treinos/aluno/${encodeURIComponent(alunoId)}`,
            {
                params: diaSemana ? { diaSemana } : undefined,
            }
        );
        return response.data;
    } catch (error) {
        logError("Erro ao listar treinos do aluno: ", error);
        throw error;
    }
};

export const findMeusTreinos = async (diaSemana?: DiaSemana): Promise<Treino[]> => {
    try {
        const response = await http.get<Treino[]>("/api/treinos/meus-treinos", {
            params: diaSemana ? { diaSemana } : undefined,
        });
        return response.data;
    } catch (error) {
        logError("Erro ao listar meus treinos: ", error);
        throw error;
    }
};

export const deleteTreino = async (id: string): Promise<void> => {
    try {
        await http.delete(`/api/treinos/${encodeURIComponent(id)}`);
    } catch (error) {
        logError("Erro ao excluir treino: ", error);
        throw error;
    }
};
