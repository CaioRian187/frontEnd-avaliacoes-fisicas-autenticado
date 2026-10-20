import { useEffect, useState } from "react";
import { getTokenDecoded } from "../utils/Auth";
import { Link } from "react-router-dom";
import { UserProfileDrawer } from "../components/UserProfileDrawer";

export const HomePage = () => {

    const [isAdmin, setIsAdmin] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

            {/* Perfil exibido apenas na tela de menu, ocupando o lugar do botao Voltar das demais telas */}
            <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                aria-label="Abrir perfil do usuário"
                className="fixed top-4 left-4 z-40 flex items-center gap-2 bg-white text-blue-700 font-semibold px-3 py-2 rounded-2xl shadow-md hover:bg-blue-50 transition-colors"
            >
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                    <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="2" />
                    <path d="M5 19.5a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Perfil
            </button>

            <UserProfileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

            <div className="text-center mb-12">
                {/* Responsividade: titulo escala em telas pequenas mantendo text-5xl em md+ */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-800 drop-shadow-sm">
                    Seja bem vindo ao sistema
                </h1>
                <p className="text-lg text-slate-700 mt-3 font-medium">
                    Selecione uma das opções abaixo para gerenciar o sistema
                </p>
            </div>

            {isAdmin ? (
                // Responsividade: cards empilham (flex-col) em mobile e voltam a row a partir de md
                <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-2">

                    <Link
                        to="/alunos"
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
                        to="/dobras"
                        className="flex flex-col justify-center items-center bg-white p-8 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 border-2 border-transparent hover:border-blue-500"
                    >
                        <span className="text-2xl font-bold text-gray-800">Dobras Cutâneas</span>
                        <p className="text-sm text-gray-500 mt-2">
                            Acesse todas as informações sobre as dobras cutâneas
                        </p>
                    </Link>

                    <Link
                        to="/estatisticas"
                        className="flex flex-col justify-center items-center bg-white p-8 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 border-2 border-transparent hover:border-blue-500"
                    >
                        <span className="text-2xl font-bold text-gray-800">Estatísticas</span>
                        <p className="text-sm text-gray-500 mt-2">
                            Emita relatórios de avaliação e comparativos
                        </p>
                    </Link>

                    <Link
                        to="/treinos"
                        className="flex flex-col justify-center items-center bg-white p-8 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 border-2 border-transparent hover:border-blue-500"
                    >
                        <span className="text-2xl font-bold text-gray-800">Treinamento</span>
                        <p className="text-sm text-gray-500 mt-2">
                            Monte e gerencie as fichas de treino dos alunos
                        </p>
                    </Link>

                </div>
            ) : (
                // Responsividade: cards empilham (flex-col) em mobile e voltam a row a partir de md
                <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-2">
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
                        to="/dobras"
                        className="flex flex-col justify-center items-center bg-white p-8 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 border-2 border-transparent hover:border-blue-500"
                    >
                        <span className="text-2xl font-bold text-gray-800">Dobras Cutâneas</span>
                        <p className="text-sm text-gray-500 mt-2">
                            Acesse todas as informações sobre as dobras cutâneas
                        </p>
                    </Link>

                    <Link
                        to="/estatisticas"
                        className="flex flex-col justify-center items-center bg-white p-8 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 border-2 border-transparent hover:border-blue-500"
                    >
                        <span className="text-2xl font-bold text-gray-800">Estatísticas</span>
                        <p className="text-sm text-gray-500 mt-2">
                            Emita seus relatórios de avaliação e comparativos
                        </p>
                    </Link>

                    <Link
                        to="/treinos"
                        className="flex flex-col justify-center items-center bg-white p-8 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 border-2 border-transparent hover:border-blue-500"
                    >
                        <span className="text-2xl font-bold text-gray-800">Treinos</span>
                        <p className="text-sm text-gray-500 mt-2">
                            Acesse as fichas de treino montadas para você
                        </p>
                    </Link>
                </div>
            )}

        </div>
    );
}