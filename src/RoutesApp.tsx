import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { CasdastroPage } from "./pages/CadastroPage";
import { CircunferenciasPage } from "./pages/CircunferenciasPage";
import { HomePage } from "./pages/HomePage";
import { AlunosPage } from "./pages/AlunosPage";
import { DobrasPage } from "./pages/DobrasPage";
import { EstatisticasPage } from "./pages/EstatisticasPage";
import { TreinosPage } from "./pages/TreinosPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminRoute } from "./components/AdminRoute";


export const RoutesApp = () => {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/cadastro" element={<CasdastroPage />} />
            <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/alunos" element={<AdminRoute><AlunosPage /></AdminRoute>} />
            <Route path="/circunferencias" element={<ProtectedRoute><CircunferenciasPage /></ProtectedRoute>} />
            <Route path="/dobras" element={<ProtectedRoute><DobrasPage /></ProtectedRoute>} />
            <Route path="/estatisticas" element={<ProtectedRoute><EstatisticasPage /></ProtectedRoute>} />
            <Route path="/treinos" element={<ProtectedRoute><TreinosPage /></ProtectedRoute>} />
        </Routes>
    );
}
