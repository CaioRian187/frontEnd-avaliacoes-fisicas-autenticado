import React, { useEffect, useState } from "react";
import { HeaderApp } from "../components/HeaderApp";
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
        // Layout global: conteudo alinhado ao topo (justify-start) para aproximar as telas do icone e evitar folga vertical
        <div className="min-h-screen bg-blue-300 flex flex-col items-center justify-start p-4 overflow-x-hidden">
            <div className="w-full flex flex-col items-center">
                <HeaderApp />
                {children}
            </div>
            <ModalSessaoExpirada isOpen={isSessionExpired} onConfirm={onConfirmRedirect} />
        </div>
    );

}
