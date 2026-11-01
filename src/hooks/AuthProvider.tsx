import { useCallback, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import type { UserToken } from "../interfaces/UserToken";
import { handleLogout } from "../services/AuthService";
import { getTokenDecoded } from "../utils/Auth";
import { AuthContext, type AuthContextValue } from "./AuthContext";

export const AuthProvider = ({ children }: PropsWithChildren) => {

    const [user, setUser] = useState<UserToken | null>(() => getTokenDecoded());

    const refresh = useCallback(() => {
        setUser(getTokenDecoded());
    }, []);

    const login = useCallback((token: string): boolean => {
        localStorage.setItem("token", token);
        const decodificado = getTokenDecoded();
        setUser(decodificado);
        return Boolean(decodificado);
    }, []);

    const logout = useCallback(() => {
        handleLogout();
        setUser(null);
    }, []);

    useEffect(() => {
        const handleSessionExpired = () => setUser(null);

        const handleStorage = (event: StorageEvent) => {
            if (event.key === "token" || event.key === null) {
                refresh();
            }
        };

        window.addEventListener("session-expired", handleSessionExpired);
        window.addEventListener("storage", handleStorage);

        return () => {
            window.removeEventListener("session-expired", handleSessionExpired);
            window.removeEventListener("storage", handleStorage);
        };
    }, [refresh]);

    const value = useMemo<AuthContextValue>(() => ({
        user,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === "ADMIN",
        login,
        logout,
        refresh,
    }), [user, login, logout, refresh]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
