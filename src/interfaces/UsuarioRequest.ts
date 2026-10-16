// DTO aceito pelo PUT /api/user/{id}: somente campos editáveis de perfil.
export interface UsuarioUpdateRequest {
    nome: string;
    idade: number;
    sexo: string;
}
