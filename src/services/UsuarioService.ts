import { logError } from "../utils/logger";
import { http } from "./http";
import type { Usuario } from "../interfaces/Usuario";
import type { UsuarioUpdateRequest } from "../interfaces/UsuarioRequest";

export const findAllUsuariosProjetions = async (): Promise<Usuario[]> => {
    try {
        const response = await http.get<Usuario[]>("/api/user/listar-usuarios-projetions");
        return response.data;
    } catch (error) {
        logError("Erro ao listar projeções de usuários: ", error);
        throw error;
    }
}

export const findAllUsuarios = async (): Promise<Usuario[]> => {
    try {
        const response = await http.get<Usuario[]>("/api/user/listar-usuarios");
        return response.data;
    } catch (error) {
        logError("Erro ao listar usuários: ", error);
        throw error;
    }
}

export const findUsuarioById = async (id: string): Promise<Usuario> => {
    try {
        const response = await http.get<Usuario>(`/api/user/${encodeURIComponent(id)}`);
        return response.data;
    } catch (error) {
        logError("Erro ao buscar usuário por id: ", error);
        throw error;
    }
}

export const findUsuariosByNome = async (nome: string): Promise<Usuario[]> => {
    try {
        const response = await http.get<Usuario[]>(
            `/api/user/nome/${encodeURIComponent(nome)}`
        );
        return response.data;
    } catch (error) {
        logError("Erro ao buscar usuários por nome: ", error);
        throw error;
    }
}

export const updateUsuario = async (id: string, usuario: UsuarioUpdateRequest): Promise<Usuario> => {
    try {
        const response = await http.put<Usuario>(
            `/api/user/${encodeURIComponent(id)}`,
            usuario
        );
        return response.data;
    } catch (error) {
        logError("Erro ao atualizar usuário: ", error);
        throw error;
    }
}

export const deleteUsuarioById = async (id: string): Promise<void> => {
    try {
        await http.delete(`/api/user/${encodeURIComponent(id)}`);
    } catch (error) {
        logError("Erro ao deletar usuário: ", error);
        throw error;
    }
}
