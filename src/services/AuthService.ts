import { http } from "./http";
import type { LoginRequest } from "../interfaces/LoginRequest";
import type { CadastroRequest } from "../interfaces/CadastroRequest";

export const handleLogin = async (loginRequest: LoginRequest) => {
    const response = await http.post("/auth/login", loginRequest);
    return response.data;
}

export const handleCadastro = async (cadastroRequest: CadastroRequest) => {
    const response = await http.post("/auth/cadastro", cadastroRequest);
    return response.data;
}

export const handleLogout = () => {
    localStorage.removeItem("token");
}
