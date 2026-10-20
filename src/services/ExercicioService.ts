import axios from "axios";
import type { Exercicio, ExercicioRequest, GrupoMuscular } from "../interfaces/Exercicio";

const API_URL = import.meta.env.VITE_URL_API;

const buildAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const findAllExercicios = async (grupoMuscular?: GrupoMuscular): Promise<Exercicio[]> => {
    try {
        const response = await axios.get<Exercicio[]>(
            `${API_URL}/api/exercicios`,
            {
                ...buildAuthHeaders(),
                params: grupoMuscular ? { grupoMuscular } : undefined,
            }
        );
        return response.data;
    } catch (error) {
        console.error("Erro ao listar exercícios: ", error);
        throw error;
    }
};

export const createExercicio = async (exercicio: ExercicioRequest): Promise<Exercicio> => {
    try {
        const response = await axios.post<Exercicio>(
            `${API_URL}/api/exercicios`,
            exercicio,
            buildAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Erro ao cadastrar exercício: ", error);
        throw error;
    }
};

export const updateExercicio = async (id: string, exercicio: ExercicioRequest): Promise<Exercicio> => {
    try {
        const response = await axios.put<Exercicio>(
            `${API_URL}/api/exercicios/${id}`,
            exercicio,
            buildAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar exercício: ", error);
        throw error;
    }
};

export const deleteExercicio = async (id: string): Promise<void> => {
    try {
        await axios.delete(
            `${API_URL}/api/exercicios/${id}`,
            buildAuthHeaders()
        );
    } catch (error) {
        console.error("Erro ao excluir exercício: ", error);
        throw error;
    }
};
