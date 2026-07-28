import { useEffect, useState } from "react";
import { getTokenDecoded } from "../utils/Auth";
import { Link } from "react-router-dom";

export const HomePage = () => {

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const decodedToken = getTokenDecoded();
        if (decodedToken && decodedToken.role === "ADMIN") {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
    }, []);

    return (

        <div className="flex flex-col justify-center items-center m-4">

            <div className="text-center mb-12">
                <h1 className="text-5xl font-extrabold text-slate-800 drop-shadow-sm">
                    Seja bem vindo ao sistema
                </h1>
                <p className="text-lg text-slate-700 mt-3 font-medium">
                    Selecione uma das opções abaixo para gerenciar o sistema
                </p>
            </div>

            {isAdmin ? (
                <div className="flex flex-row justify-center items-center gap-2">

                    <Link
                        to="/"
                        className="flex flex-col justify-center items-center bg-white p-8 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 border-2 border-transparent hover:border-blue-500"
                    >
                        <span className="text-2xl font-bold text-gray-800">Alunos</span>
                        <p className="text-sm text-gray-500 mt-2">
                            Acesse todas as informações sobre os alunos
                        </p>
                    </Link>

                    <Link
                        to="/circunferencias"
                        className="flex flex-col justify-center items-center bg-white p-8 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 border-2 border-transparent hover:border-blue-500"
                    >
                        <span className="text-2xl font-bold text-gray-800">Circunferências</span>
                        <p className="text-sm text-gray-500 mt-2">
                            Acesse todas as informações sobre as circunferências
                        </p>
                    </Link>

                    <Link
                        to="/"
                        className="flex flex-col justify-center items-center bg-white p-8 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 border-2 border-transparent hover:border-blue-500"
                    >
                        <span className="text-2xl font-bold text-gray-800">Dobras Cutâneas</span>
                        <p className="text-sm text-gray-500 mt-2">
                            Acesse todas as informações sobre as dobras cutâneas
                        </p>
                    </Link>

                </div>
            ) : (
                <div className="flex flex-row justify-center items-center gap-2">
                    <Link
                        to="/circunferencias"
                        className="flex flex-col justify-center items-center bg-white p-8 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 border-2 border-transparent hover:border-blue-500"
                    >
                        <span className="text-2xl font-bold text-gray-800">Circunferências</span>
                        <p className="text-sm text-gray-500 mt-2">
                            Acesse todas as informações sobre as circunferências
                        </p>
                    </Link>

                    <Link
                        to="/"
                        className="flex flex-col justify-center items-center bg-white p-8 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 border-2 border-transparent hover:border-blue-500"
                    >
                        <span className="text-2xl font-bold text-gray-800">Dobras Cutâneas</span>
                        <p className="text-sm text-gray-500 mt-2">
                            Acesse todas as informações sobre as dobras cutâneas
                        </p>
                    </Link>
                </div>
            )}

        </div>
    );
}