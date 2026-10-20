import axios from "axios";
import type { DobraCutanea } from "../interfaces/DobraCutanea";
import type { DobrasRequest } from "../interfaces/DobrasRequest";

const API_URL = import.meta.env.VITE_URL_API;

// Monta o header de autorizacao padrao usado em todos os endpoints de dobras cutaneas.
const buildAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const findAllDobras = async (): Promise<DobraCutanea[]> => {
    try {
        const response = await axios.get<DobraCutanea[]>(
            `${API_URL}/dobrasCutaneas`,
            buildAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Erro ao listar dobras cutâneas: ", error);
        throw error;
    }
}

export const findAllDobrasByAlunoId = async (alunoId: string): Promise<DobraCutanea[]> => {
    try {
        const response = await axios.get<DobraCutanea[]>(
            `${API_URL}/dobrasCutaneas/aluno/${alunoId}`,
            buildAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Erro ao listar dobras cutâneas do aluno: ", error);
        throw error;
    }
}

export const findDobraById = async (id: string | number): Promise<DobraCutanea> => {
    try {
        const response = await axios.get<DobraCutanea>(
            `${API_URL}/dobrasCutaneas/${id}`,
            buildAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar dobra cutânea por id: ", error);
        throw error;
    }
}

export const createDobra = async (dobra: DobrasRequest): Promise<DobraCutanea> => {
    try {
        const response = await axios.post<DobraCutanea>(
            `${API_URL}/dobrasCutaneas`,
            dobra,
            buildAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Erro ao cadastrar dobra cutânea: ", error);
        throw error;
    }
}

export const updateDobra = async (id: string | number, dobra: DobrasRequest): Promise<DobraCutanea> => {
    try {
        const response = await axios.put<DobraCutanea>(
            `${API_URL}/dobrasCutaneas/${id}`,
            dobra,
            buildAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar dobra cutânea: ", error);
        throw error;
    }
}

export const deleteDobraById = async (id: string | number): Promise<void> => {
    try {
        await axios.delete(
            `${API_URL}/dobrasCutaneas/${id}`,
            buildAuthHeaders()
        );
    } catch (error) {
        console.error("Erro ao deletar dobra cutânea: ", error);
        throw error;
    }
}
