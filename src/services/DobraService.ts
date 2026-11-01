import { logError } from "../utils/logger";
import { http } from "./http";
import type { DobraCutanea } from "../interfaces/DobraCutanea";
import type { DobrasRequest } from "../interfaces/DobrasRequest";

export const findAllDobras = async (): Promise<DobraCutanea[]> => {
    try {
        const response = await http.get<DobraCutanea[]>("/dobrasCutaneas");
        return response.data;
    } catch (error) {
        logError("Erro ao listar dobras cutâneas: ", error);
        throw error;
    }
}

export const findAllDobrasByAlunoId = async (alunoId: string): Promise<DobraCutanea[]> => {
    try {
        const response = await http.get<DobraCutanea[]>(
            `/dobrasCutaneas/aluno/${encodeURIComponent(alunoId)}`
        );
        return response.data;
    } catch (error) {
        logError("Erro ao listar dobras cutâneas do aluno: ", error);
        throw error;
    }
}

export const findDobraById = async (id: string | number): Promise<DobraCutanea> => {
    try {
        const response = await http.get<DobraCutanea>(
            `/dobrasCutaneas/${encodeURIComponent(String(id))}`
        );
        return response.data;
    } catch (error) {
        logError("Erro ao buscar dobra cutânea por id: ", error);
        throw error;
    }
}

export const createDobra = async (dobra: DobrasRequest): Promise<DobraCutanea> => {
    try {
        const response = await http.post<DobraCutanea>("/dobrasCutaneas", dobra);
        return response.data;
    } catch (error) {
        logError("Erro ao cadastrar dobra cutânea: ", error);
        throw error;
    }
}

export const updateDobra = async (id: string | number, dobra: DobrasRequest): Promise<DobraCutanea> => {
    try {
        const response = await http.put<DobraCutanea>(
            `/dobrasCutaneas/${encodeURIComponent(String(id))}`,
            dobra
        );
        return response.data;
    } catch (error) {
        logError("Erro ao atualizar dobra cutânea: ", error);
        throw error;
    }
}

export const deleteDobraById = async (id: string | number): Promise<void> => {
    try {
        await http.delete(`/dobrasCutaneas/${encodeURIComponent(String(id))}`);
    } catch (error) {
        logError("Erro ao deletar dobra cutânea: ", error);
        throw error;
    }
}
