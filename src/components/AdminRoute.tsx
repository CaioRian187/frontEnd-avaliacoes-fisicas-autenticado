import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface AdminRouteProps {
    children: ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
    const { isAdmin } = useAuth();

    if (!isAdmin) {
        return <Navigate to="/home" replace />;
    }

    return <>{children}</>;
};
