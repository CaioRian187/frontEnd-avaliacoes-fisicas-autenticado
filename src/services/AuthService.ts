import axios from "axios"
import type { LoginRequest } from "../interfaces/LoginRequest";
import type { CadastroRequest } from "../interfaces/CadastroRequest";

const API_URL = import.meta.env.VITE_URL_API;

export const handleLogin = async (loginRequest: LoginRequest) => {

    try {
        const response = await axios.post(API_URL + "/auth/login", loginRequest);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const handleCadastro = async (cadastroRequest: CadastroRequest) => {

    try {
        const response = await axios.post(API_URL + "/auth/cadastro", cadastroRequest);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }

}

export const handleLogout = () => {
    localStorage.removeItem("token");
}

