import { logError } from "../utils/logger";
import { http } from "./http";
import type { Circunferencia } from "../interfaces/Circunferencia";
import type { CircunferenciasRequest } from "../interfaces/CircunferenciasRequest";

export const findAllCircunferenciasByAlunoId = async (alunoId: string): Promise<Circunferencia[]> => {
    try {
        const response = await http.get<Circunferencia[]>(
            `/circunferencias/aluno/${encodeURIComponent(alunoId)}`
        );
        return response.data;
    } catch (error) {
        logError(error);
        throw error;
    }
}

export const findCircunferenciaById = async (id: string | number): Promise<Circunferencia> => {
    try {
        const response = await http.get<Circunferencia>(
            `/circunferencias/${encodeURIComponent(String(id))}`
        );
        return response.data;
    } catch (error) {
        logError(error);
        throw error;
    }
}

export const createCircunferencia = async (circunferencias: CircunferenciasRequest): Promise<Circunferencia> => {
    try {
        const response = await http.post<Circunferencia>("/circunferencias", circunferencias);
        return response.data;
    } catch (error) {
        logError(error);
        throw error;
    }
}

export const updateCircunferencia = async (
    id: string | number,
    circunferencias: CircunferenciasRequest
): Promise<Circunferencia> => {
    try {
        const response = await http.put<Circunferencia>(
            `/circunferencias/${encodeURIComponent(String(id))}`,
            circunferencias
        );
        return response.data;
    } catch (error) {
        logError("Erro ao atualizar circunferência: ", error);
        throw error;
    }
}

export const deleteCircunferenciasById = async (circunrenciaId: number) => {
    try {
        await http.delete(`/circunferencias/${encodeURIComponent(String(circunrenciaId))}`);
    } catch (error) {
        logError(error);
        throw error;
    }
}
