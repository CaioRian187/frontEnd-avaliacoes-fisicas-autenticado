import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { CasdastroPage } from "./pages/CadastroPage";
import { CircunferenciasPage } from "./pages/CircunferenciasPage";
import { HomePage } from "./pages/HomePage";
import { AlunosPage } from "./pages/AlunosPage";
import { DobrasPage } from "./pages/DobrasPage";
import { EstatisticasPage } from "./pages/EstatisticasPage";


export const RoutesApp = () => {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/cadastro" element={<CasdastroPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/alunos" element={<AlunosPage />} />
            <Route path="/circunferencias" element={<CircunferenciasPage />} />
            <Route path="/dobras" element={<DobrasPage />} />
            <Route path="/estatisticas" element={<EstatisticasPage />} />
        </Routes>
    );
}
