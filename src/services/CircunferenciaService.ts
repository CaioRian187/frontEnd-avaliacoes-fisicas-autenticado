import axios from "axios";
import type { Circunferencia } from "../interfaces/Circunferencia";
import type { CircunferenciasRequest } from "../interfaces/CircunferenciasRequest";

const API_URL = import.meta.env.VITE_URL_API;

// Monta o header de autorizacao padrao usado em todos os endpoints de circunferencias.
const buildAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const findAllCircunferenciasByAlunoId = async (alunoId: string): Promise<Circunferencia[]> => {

    try {
        const response = await axios.get<Circunferencia[]>(
            `${API_URL}/circunferencias/aluno/${alunoId}`,
            buildAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const findCircunferenciaById = async (id: string | number): Promise<Circunferencia> => {

    try {
        const response = await axios.get<Circunferencia>(
            `${API_URL}/circunferencias/${id}`,
            buildAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const createCircunferencia = async (circunferencias: CircunferenciasRequest): Promise<Circunferencia> => {

    try {
        const response = await axios.post<Circunferencia>(
            `${API_URL}/circunferencias`,
            circunferencias,
            buildAuthHeaders()
        );
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const updateCircunferencia = async (
    id: string | number,
    circunferencias: CircunferenciasRequest
): Promise<Circunferencia> => {

    try {
        const response = await axios.put<Circunferencia>(
            `${API_URL}/circunferencias/${id}`,
            circunferencias,
            buildAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar circunferência: ", error);
        throw error;
    }
}

export const deleteCircunferenciasById = async (circunrenciaId: number) => {

    try {
        const token = localStorage.getItem("token")
        await axios.delete(`${API_URL}/circunferencias/${circunrenciaId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    } catch (error) {
        console.error(error);
        throw error;
    }
}

