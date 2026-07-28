import { jwtDecode } from "jwt-decode";
import type { UserToken } from "../interfaces/UserToken";

export const getTokenDecoded = (): UserToken | null => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {

        const decoded = jwtDecode<UserToken>(token);

        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem("token");
            return null;
        }
        console.log(decoded);
        return decoded;

    } catch (error) {
        console.error("Token Inválido.", error);
        return null;
    }

}