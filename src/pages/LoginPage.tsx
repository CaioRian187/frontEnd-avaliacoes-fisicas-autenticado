import React, { useState } from "react";
import { Input } from "../components/Input";
import { handleLogin } from "../services/AuthService";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export const LoginPage = () => {

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const data = await handleLogin({ login, password });
            localStorage.setItem("token", data.token);
            alert("Login Realizado com sucesso!!!");
            navigate("/home");
        } catch (error) {
            alert(error);
        }

    }

    return (
        <div className="flex items-center justify-center w-full p-4">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-blue-400">
                <h1 className="text-3xl font-bold text-slate-800">
                    Bem-vindo
                </h1>
                <p className="text-slate-500 text-sm mt-2">
                    Insira suas credenciais para entrar no sistema
                </p>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-lg font-medium text-slate-700">
                            Login
                        </label>
                        <Input
                            classname="w-full px-4 py-2.5 rounded-lg border-2 border-blue-200"
                            type="text"
                            placeholder="Informe seu login (ex: joazinho5847)"
                            onChange={(e) => setLogin(e.target.value)}
                            value={login}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-lg font-medium text-slate-700">
                            Senha
                        </label>
                        <Input
                            classname="w-full px-4 py-2.5 rounded-lg border-2 border-blue-200"
                            type="password"
                            placeholder="Informe sua senha (ex: 1649464)"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg"
                    >
                        Entrar
                    </button>

                    <Link
                        className="flex flex-col text-center w-full  text-blue-500 underline"
                        to="/cadastro">
                        Não tem cadastro, cadastrar-se!!!
                    </Link>
                </form>
            </div>
        </div>
    );
}