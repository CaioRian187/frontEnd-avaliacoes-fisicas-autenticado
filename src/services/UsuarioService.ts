import { logError } from "../utils/logger";
import axios from "axios";
import type { Usuario } from "../interfaces/Usuario";
import type { UsuarioUpdateRequest } from "../interfaces/UsuarioRequest";

const API_URL = import.meta.env.VITE_URL_API;

// Monta o header de autorizacao padrao usado em todos os endpoints de usuario.
const buildAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const findAllUsuariosProjetions = async (): Promise<Usuario[]> => {
    try {
        const response = await axios.get<Usuario[]>(
            `${API_URL}/api/user/listar-usuarios-projetions`,
            buildAuthHeaders()
        );
        return response.data;
    } catch (error) {
        logError("Erro ao listar projeções de usuários: ", error);
        throw error;
    }
}

export const findAllUsuarios = async (): Promise<Usuario[]> => {
    try {
        const response = await axios.get<Usuario[]>(
            `${API_URL}/api/user/listar-usuarios`,
            buildAuthHeaders()
        );
        return response.data;
    } catch (error) {
        logError("Erro ao listar usuários: ", error);
        throw error;
    }
}

export const findUsuarioById = async (id: string): Promise<Usuario> => {
    try {
        const response = await axios.get<Usuario>(
            `${API_URL}/api/user/${id}`,
            buildAuthHeaders()
        );
        return response.data;
    } catch (error) {
        logError("Erro ao buscar usuário por id: ", error);
        throw error;
    }
}

export const findUsuariosByNome = async (nome: string): Promise<Usuario[]> => {
    try {
        const response = await axios.get<Usuario[]>(
            `${API_URL}/api/user/nome/${encodeURIComponent(nome)}`,
            buildAuthHeaders()
        );
        return response.data;
    } catch (error) {
        logError("Erro ao buscar usuários por nome: ", error);
        throw error;
    }
}

export const updateUsuario = async (id: string, usuario: UsuarioUpdateRequest): Promise<Usuario> => {
    try {
        const response = await axios.put<Usuario>(
            `${API_URL}/api/user/${id}`,
            usuario,
            buildAuthHeaders()
        );
        return response.data;
    } catch (error) {
        logError("Erro ao atualizar usuário: ", error);
        throw error;
    }
}

export const deleteUsuarioById = async (id: string): Promise<void> => {
    try {
        await axios.delete(
            `${API_URL}/api/user/${id}`,
            buildAuthHeaders()
        );
    } catch (error) {
        logError("Erro ao deletar usuário: ", error);
        throw error;
    }
}
