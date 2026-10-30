import { logError } from "../utils/logger";
import axios from "axios";
import type { DiaSemana, Treino, TreinoRequest } from "../interfaces/Treino";

const API_URL = import.meta.env.VITE_URL_API;

const buildAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const createTreino = async (treino: TreinoRequest): Promise<Treino> => {
    try {
        const response = await axios.post<Treino>(
            `${API_URL}/api/treinos`,
            treino,
            buildAuthHeaders()
        );
        return response.data;
    } catch (error) {
        logError("Erro ao cadastrar treino: ", error);
        throw error;
    }
};

export const findAllTreinosByAlunoId = async (alunoId: string, diaSemana?: DiaSemana): Promise<Treino[]> => {
    try {
        const response = await axios.get<Treino[]>(
            `${API_URL}/api/treinos/aluno/${alunoId}`,
            {
                ...buildAuthHeaders(),
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
        const response = await axios.get<Treino[]>(
            `${API_URL}/api/treinos/meus-treinos`,
            {
                ...buildAuthHeaders(),
                params: diaSemana ? { diaSemana } : undefined,
            }
        );
        return response.data;
    } catch (error) {
        logError("Erro ao listar meus treinos: ", error);
        throw error;
    }
};

export const deleteTreino = async (id: string): Promise<void> => {
    try {
        await axios.delete(
            `${API_URL}/api/treinos/${id}`,
            buildAuthHeaders()
        );
    } catch (error) {
        logError("Erro ao excluir treino: ", error);
        throw error;
    }
};
