import React, { useEffect, useState } from "react";
import { HeaderApp } from "../components/HeaderApp";
import { Footer } from "../components/Footer";
import { ModalSessaoExpirada } from "../components/ModalSessaoExpirada";
import { useNavigate } from "react-router-dom";


export const LayoutApp = ({ children }: React.PropsWithChildren) => {

    const [isSessionExpired, setIsSessionExpired] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleSessionExpired = () => {
            setIsSessionExpired(true);
        };

        window.addEventListener("session-expired", handleSessionExpired);

        return () => {
            window.removeEventListener("session-expired", handleSessionExpired);
        };
    }, []);

    const onConfirmRedirect = () => {
        setIsSessionExpired(false);
        navigate("/");
    };

    return (
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
