import React from "react";
import { HeaderApp } from "../components/HeaderApp";


export const LayoutApp = ({ children }: React.PropsWithChildren) => {

    return (
        // Layout global: conteudo alinhado ao topo (justify-start) para aproximar as telas do icone e evitar folga vertical
        <div className="min-h-screen bg-blue-300 flex flex-col items-center justify-start p-4 overflow-x-hidden">
            <div className="w-full flex flex-col items-center">
                <HeaderApp />
                {children}
            </div>
        </div>
    );

}