import axios from "axios";
import type { CircunferenciasRequest } from "../interfaces/CircunferenciasRequest";

const API_URL = import.meta.env.VITE_URL_API;

export const findAllCircunferenciasByAlunoId = async (alunoId: string) => {

    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/circunferencias/aluno/${alunoId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const createCircunferencia = async (circunferencias: CircunferenciasRequest) => {

    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${API_URL}/circunferencias`, circunferencias, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

