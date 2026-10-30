import { logError } from "./logger";
import { jwtDecode } from "jwt-decode";
import type { UserToken } from "../interfaces/UserToken";

export const getTokenDecoded = (): UserToken | null => {

    const token = localStorage.getItem("token");
    if (!token) {
        return null;
    }

    try {

        const decoded = jwtDecode<UserToken>(token);

        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem("token");
            window.dispatchEvent(new Event("session-expired"));
            return null;
        }
        return decoded;

    } catch (error) {
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("session-expired"));
        logError("Token Inválido.", error);
        return null;
    }

}
