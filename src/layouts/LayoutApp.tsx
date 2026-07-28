import React from "react";
import { HeaderApp } from "../components/HeaderApp";


export const LayoutApp = ({ children }: React.PropsWithChildren) => {

    return (
        <div className="min-h-screen bg-blue-300 flex flex-col items-center justify-center p-4">
            <div className="w-full flex flex-col items-center">
                <HeaderApp />
                {children}
            </div>
        </div>
    );

}