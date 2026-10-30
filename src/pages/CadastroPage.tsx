import React, { useState } from "react";
import { Input } from "../components/Input";
import { handleCadastro } from "../services/AuthService";
import type { CadastroRequest } from "../interfaces/CadastroRequest";
import { GENERO_OPTIONS, type GeneroEnum } from "../interfaces/Genero";
import { Link, useNavigate } from "react-router-dom";
import { BotaoVoltar } from "../components/BotaoVoltar";
import { useFeedbackModal } from "../hooks/useFeedback";
import { extrairMensagemErro } from "../utils/ErrorUtils";
import { CampoListaStrings } from "../components/CampoListaStrings";
import { listasObrigatoriasValidas } from "../utils/ListaStrings";


export const CasdastroPage = () => {

    const [nome, setNome] = useState("");
    const [idade, setIdade] = useState<number | string>("");
    const [genero, setGenero] = useState<GeneroEnum | "">("");
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [deficiencias, setDeficiencias] = useState<string[]>([]);
    const [lezoes, setLezoes] = useState<string[]>([]);

    const navigate = useNavigate();
    const { showFeedback, showWarning, showError } = useFeedbackModal();

    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nome || !idade || !genero || !login || !password) {
            showWarning("Por favor, preencha todos os campos!");
            return;
        }

        if (!listasObrigatoriasValidas(deficiencias, lezoes)) {
            showWarning("Responda as perguntas sobre deficiência e lesão ou adicione ao menos um item em cada uma.");
            return;
        }

        const cadastroRequest: CadastroRequest = {
            nome: nome,
            idade: Number(idade),
            genero: genero,
            login: login,
            password: password,
            deficiencias: deficiencias,
            lezoes: lezoes
        }

        try {
            await handleCadastro(cadastroRequest);
            showFeedback({
                type: "success",
                message: "Usuário cadastrado com sucesso!",
                onClose: () => navigate("/"),
            });
        } catch (error) {
            console.error("Erro ao cadastrar: ", error);
            showError(extrairMensagemErro(error, "Falha ao realizar o cadastro. Verifique todos os dados inseridos."));
        }
    }


    return (
        // Responsividade: padding externo adicionado para o card nao encostar nas bordas em telas pequenas
        <div className="flex items-center justify-center w-full p-4">
            <BotaoVoltar to="/" />
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
                                    Gênero
                                </label>

                                <select
                                    className="w-full px-4 py-2.5 rounded-lg border-2 border-blue-200"
                                    value={genero}
                                    onChange={(e) => setGenero(e.target.value as GeneroEnum)}
                                >
                                    <option value="" disabled hidden>Selecione o gênero</option>
                                    {GENERO_OPTIONS.map((opcao) => (
                                        <option key={opcao.value} value={opcao.value}>{opcao.label}</option>
                                    ))}
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start border-t border-gray-200 pt-5">
                        <CampoListaStrings
                            pergunta="Possui alguma deficiência?"
                            placeholder="Descreva a deficiência"
                            valores={deficiencias}
                            onChange={setDeficiencias}
                        />

                        <CampoListaStrings
                            pergunta="Possui alguma lesão?"
                            placeholder="Descreva a lesão"
                            valores={lezoes}
                            onChange={setLezoes}
                        />
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