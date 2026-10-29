import type { GeneroEnum } from "./Genero";

// DTO aceito pelo PUT /api/user/{id}: somente campos editáveis de perfil.
export interface UsuarioUpdateRequest {
    nome: string;
    idade: number;
    genero: GeneroEnum;
    deficiencias: string[];
    lezoes: string[];
}
