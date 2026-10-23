import type { GeneroEnum } from "./Genero";

export interface CadastroRequest {
    nome: string,
    idade: number,
    genero: GeneroEnum,
    login: string,
    password: string
}