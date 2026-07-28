import React, { useState } from "react";
import { Input } from "../components/Input";
import { handleCadastro } from "../services/AuthService";
import type { CadastroRequest } from "../interfaces/CadastroRequest";
import { Link, useNavigate } from "react-router-dom";


export const CasdastroPage = () => {

    const [nome, setNome] = useState("");
    const [idade, setIdade] = useState<number | string>("");
    const [sexo, setSexo] = useState("");
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nome || !idade || !sexo || !login || !password) {
            alert("Por favor, preencha todos os campos!");
            return;
        }

        const cadastroRequest: CadastroRequest = {
            nome: nome,
            idade: Number(idade),
            sexo: sexo,
            login: login,
            password: password
        }

        try {
            await handleCadastro(cadastroRequest);
            alert("Usuário cadastrado com sucesso!!!");
            navigate("/");
        } catch (error) {
            console.error("Erro ao cadastrar: ", error);
            alert("Falha ao realizar o cadastro. Verifique todos os dados inseridos.");
        }
    }


    return (
        <div className="flex items-center justify-center w-full">
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 border border-blue-400">
                <h1 className="text-3xl font-bold text-slate-800">
                    Cadastro
                </h1>
                <p className="text-slate-500 text-sm mt-2">
                    Insira suas informações para se cadastrar no sistema
                </p>

                <form onSubmit={handleSubmitForm} className="space-y-5">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">

                        <div className="flex flex-col gap-4">

                            <div className="flex flex-col gap-1.5">
                                <label className="text-lg font-medium text-slate-700">
                                    Nome
                                </label>
                                <Input
                                    classname="w-full px-4 py-2.5 rounded-lg border-2 border-blue-200"
                                    type="text"
                                    placeholder="Informe seu nome (ex: joãozinho)"
                                    onChange={(e) => setNome(e.target.value)}
                                    value={nome}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-lg font-medium text-slate-700">
                                    Idade
                                </label>
                                <Input
                                    classname="w-full px-4 py-2.5 rounded-lg border-2 border-blue-200"
                                    type="number"
                                    placeholder="Informe sua idade (ex: 20)"
                                    onChange={(e) => setIdade(Number(e.target.value))}
                                    value={idade}
                                />
                            </div>

                            <div className="flex flex-col gap-.5">
                                <label className="text-lg font-medium text-slate-700">
                                    Sexo
                                </label>

                                <select
                                    className="w-full px-4 py-2.5 rounded-lg border-2 border-blue-200"
                                    value={sexo}
                                    onChange={(e) => setSexo(e.target.value)}
                                >
                                    <option value="" disabled hidden>Selecione o sexo</option>
                                    <option value="MASCULINO">Masculino</option>
                                    <option value="FEMININO">Feminino</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <div className="flex flex-col gap-2.5">
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

                            <div className="flex flex-col gap-2.5 mt-2">
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
                        </div>

                    </div>


                    <button
                        type="submit"
                        className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg"
                    >
                        Cadastrar
                    </button>

                    <Link
                        to="/"
                        className="flex flex-col text-center w-full text-md text-blue-500 underline"
                    >
                        Já tenho cadastro, voltar para Login!!!
                    </Link>

                </form>
            </div>
        </div>
    );
}