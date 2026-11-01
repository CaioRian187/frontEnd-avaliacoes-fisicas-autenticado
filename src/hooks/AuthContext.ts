import { createContext } from "react";
import type { UserToken } from "../interfaces/UserToken";

export interface AuthContextValue {
    user: UserToken | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (token: string) => boolean;
    logout: () => void;
    refresh: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
