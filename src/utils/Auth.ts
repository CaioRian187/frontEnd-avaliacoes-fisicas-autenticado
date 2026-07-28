import { jwtDecode } from "jwt-decode";
import type { UserToken } from "../interfaces/UserToken";

export const getTokenDecoded = (): UserToken | null => {

    const token = localStorage.getItem("token");
    if (!token) {
        alert("Token não encontrado. Por favor, faça login novamente.");
        return null;
    }

    try {

        const decoded = jwtDecode<UserToken>(token);

        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem("token");
            alert("Token expirado. Por favor, faça login novamente.");
            return null;
        }
        console.log(decoded);
        return decoded;

    } catch (error) {
        alert("Token Inválido.");
        console.error("Token Inválido.", error);
        return null;
    }

}