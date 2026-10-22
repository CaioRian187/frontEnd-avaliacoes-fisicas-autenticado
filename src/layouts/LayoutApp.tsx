import React, { useEffect, useState } from "react";
import { HeaderApp } from "../components/HeaderApp";
import { Footer } from "../components/Footer";
import { ModalSessaoExpirada } from "../components/ModalSessaoExpirada";
import { useNavigate } from "react-router-dom";
import axios from "axios";


export const LayoutApp = ({ children }: React.PropsWithChildren) => {

    const [isSessionExpired, setIsSessionExpired] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleSessionExpired = () => {
            setIsSessionExpired(true);
        };

        window.addEventListener("session-expired", handleSessionExpired);

        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem("token");
                    window.dispatchEvent(new Event("session-expired"));
                }
                return Promise.reject(error);
            }
        );

        return () => {
            window.removeEventListener("session-expired", handleSessionExpired);
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

    const onConfirmRedirect = () => {
        setIsSessionExpired(false);
        navigate("/");
    };

    return (
        // Layout global: coluna flexivel com sticky footer, conteudo cresce e empurra o rodape para o fim
        <div className="min-h-screen bg-blue-300 flex flex-col items-center p-4 overflow-x-hidden">
            <div className="w-full flex-1 flex flex-col items-center">
                <HeaderApp />
                {children}
            </div>
            <Footer />
            <ModalSessaoExpirada isOpen={isSessionExpired} onConfirm={onConfirmRedirect} />
        </div>
    );

}
