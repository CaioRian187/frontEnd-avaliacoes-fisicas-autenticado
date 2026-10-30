import { logError } from "../utils/logger";
import React, { useCallback, useEffect, useState } from "react";
import { getTokenDecoded } from "../utils/Auth";
import { findAllUsuarios, findUsuariosByNome } from "../services/UsuarioService";
import type { Usuario } from "../interfaces/Usuario";
import { ModalEditarAluno } from "../components/ModalEditarAluno";
import { ListaAlunos } from "../components/ListaAlunos";
import { Input } from "../components/Input";
import { BotaoVoltar } from "../components/BotaoVoltar";
import { useFeedbackModal } from "../hooks/useFeedback";

export const AlunosPage = () => {

    const { showError } = useFeedbackModal();
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [usuarioEmEdicao, setUsuarioEmEdicao] = useState<Usuario | null>(null);
    const [buscaNome, setBuscaNome] = useState<string>("");

    const carregarUsuarios = useCallback(async () => {
        try {
            const lista = await findAllUsuarios();
            setUsuarios(lista);
        } catch (error) {
            logError("Erro ao carregar alunos: ", error);
            showError("Não foi possível carregar a lista de alunos.");
        }
    }, [showError]);

    useEffect(() => {
        const tokenDecoded = getTokenDecoded();

        if (tokenDecoded?.role === "ADMIN") {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }

        carregarUsuarios();
    }, [carregarUsuarios]);

    const handleBuscarPorNome = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const nome = buscaNome.trim();

            if (nome === "") {
                await carregarUsuarios();
                return;
            }

            const lista = await findUsuariosByNome(nome);
            setUsuarios(lista);
        } catch (error) {
            logError("Erro ao buscar alunos por nome: ", error);
            showError("Não foi possível buscar os alunos pelo nome informado.");
        }
    }

    const handleLimparBusca = async () => {
        setBuscaNome("");
        await carregarUsuarios();
    }

    return (
        <div className="mt-2 flex flex-col items-center w-full">
            <BotaoVoltar />
            <h1 className="mb-4 text-2xl text-gray-800 font-semibold">Alunos</h1>

            {/* Edicao de aluno exibida em modal, mantendo o mesmo padrao visual das demais telas */}
            {usuarioEmEdicao && (
                <ModalEditarAluno
                    usuario={usuarioEmEdicao}
                    usuarios={usuarios}
                    setUsuarios={setUsuarios}
                    onClose={() => setUsuarioEmEdicao(null)}
                />
            )}

            {/* Responsividade: campo de busca e botoes empilham em mobile e voltam a row a partir de sm */}
            <form
                onSubmit={handleBuscarPorNome}
                className="w-full max-w-6xl flex flex-col sm:flex-row gap-2 mb-4"
            >
                <Input
                    classname="w-full bg-white border rounded-md px-3 py-2"
                    placeholder="Buscar aluno pelo nome"
                    type="text"
                    value={buscaNome}
                    onChange={(e) => setBuscaNome(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-2xl hover:bg-blue-600"
                >
                    Buscar
                </button>
                <button
                    type="button"
                    onClick={handleLimparBusca}
                    className="bg-gray-400 text-white px-4 py-2 rounded-2xl hover:bg-gray-500"
                >
                    Limpar
                </button>
            </form>

            <ListaAlunos
                isAdmin={isAdmin}
                usuarios={usuarios}
                setUsuarios={setUsuarios}
                onEdit={setUsuarioEmEdicao}
            />
        </div>
    );
}
