import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { AdminRoute } from "./AdminRoute";

const mocks = vi.hoisted(() => ({
    auth: {
        isAuthenticated: false,
        isAdmin: false,
    },
}));

vi.mock("../hooks/useAuth", () => ({
    useAuth: () => mocks.auth,
}));

const renderRotas = (entrada: string) =>
    render(
        <MemoryRouter initialEntries={[entrada]}>
            <Routes>
                <Route path="/" element={<div>Tela de login</div>} />
                <Route path="/home" element={<div>Tela inicial</div>} />
                <Route
                    path="/privada"
                    element={<ProtectedRoute><div>Conteudo privado</div></ProtectedRoute>}
                />
                <Route
                    path="/admin"
                    element={<AdminRoute><div>Conteudo admin</div></AdminRoute>}
                />
            </Routes>
        </MemoryRouter>
    );

describe("rotas protegidas", () => {
    beforeEach(() => {
        mocks.auth.isAuthenticated = false;
        mocks.auth.isAdmin = false;
    });

    it("redireciona usuario sem token para o login", () => {
        renderRotas("/privada");

        expect(screen.getByText("Tela de login")).toBeInTheDocument();
    });

    it("libera rota privada para usuario autenticado", () => {
        mocks.auth.isAuthenticated = true;

        renderRotas("/privada");

        expect(screen.getByText("Conteudo privado")).toBeInTheDocument();
    });

    it("redireciona usuario comum da rota de admin", () => {
        mocks.auth.isAuthenticated = true;
        mocks.auth.isAdmin = false;

        renderRotas("/admin");

        expect(screen.getByText("Tela inicial")).toBeInTheDocument();
    });

    it("libera rota de admin para administrador", () => {
        mocks.auth.isAuthenticated = true;
        mocks.auth.isAdmin = true;

        renderRotas("/admin");

        expect(screen.getByText("Conteudo admin")).toBeInTheDocument();
    });
});
