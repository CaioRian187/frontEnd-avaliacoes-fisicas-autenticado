import type { GeneroEnum } from "./Genero";

export interface Usuario {
    id?: string;
    nome?: string;
    idade?: number;
    genero?: GeneroEnum;
    login?: string;
    password?: string;
    role?: string;
}
