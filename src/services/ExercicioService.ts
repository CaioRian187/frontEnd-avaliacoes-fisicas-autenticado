import { logError } from "../utils/logger";
import { http } from "./http";
import type { Exercicio, ExercicioRequest, GrupoMuscular } from "../interfaces/Exercicio";

export const findAllExercicios = async (grupoMuscular?: GrupoMuscular): Promise<Exercicio[]> => {
    try {
        const response = await http.get<Exercicio[]>("/api/exercicios", {
            params: grupoMuscular ? { grupoMuscular } : undefined,
        });
        return response.data;
    } catch (error) {
        logError("Erro ao listar exercícios: ", error);
        throw error;
    }
};

export const createExercicio = async (exercicio: ExercicioRequest): Promise<Exercicio> => {
    try {
        const response = await http.post<Exercicio>("/api/exercicios", exercicio);
        return response.data;
    } catch (error) {
        logError("Erro ao cadastrar exercício: ", error);
        throw error;
    }
};

export const updateExercicio = async (id: string, exercicio: ExercicioRequest): Promise<Exercicio> => {
    try {
        const response = await http.put<Exercicio>(
            `/api/exercicios/${encodeURIComponent(id)}`,
            exercicio
        );
        return response.data;
    } catch (error) {
        logError("Erro ao atualizar exercício: ", error);
        throw error;
    }
};

export const deleteExercicio = async (id: string): Promise<void> => {
    try {
        await http.delete(`/api/exercicios/${encodeURIComponent(id)}`);
    } catch (error) {
        logError("Erro ao excluir exercício: ", error);
        throw error;
    }
};
