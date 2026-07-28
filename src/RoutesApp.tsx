import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { CasdastroPage } from "./pages/CadastroPage";
import { CircunferenciasPage } from "./pages/CircunferenciasPage";
import { HomePage } from "./pages/HomePage";


export const RoutesApp = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/cadastro" element={<CasdastroPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/circunferencias" element={<CircunferenciasPage />} />
            </Routes>
        </BrowserRouter>
    );
}