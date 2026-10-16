import { useState } from "react";
import axios from "axios";
import type { Usuario } from "../interfaces/Usuario";
import { ModalDelete } from "./ModalDelete";
import { deleteUsuarioById } from "../services/UsuarioService";

// Extrai a mensagem devolvida pela API, evitando exibir um alert generico quando
// o back-end bloqueia a exclusao (ex: aluno com circunferencias/dobras vinculadas).
const extrairMensagemErro = (error: unknown, fallback: string): string => {
    if (axios.isAxiosError(error) && error.response?.data) {
        const data = error.response.data as Record<string, unknown> | string;

        if (typeof data === "string") return data;

        const mensagens = Object.values(data).filter(
            (valor): valor is string => typeof valor === "string"
        );

        if (mensagens.length > 0) return mensagens.join(" ");
    }

    return fallback;
};

interface ListaAlunosProps {
    isAdmin: boolean;
    usuarios: Usuario[];
    setUsuarios: (usuarios: Usuario[]) => void;
    onEdit: (usuario: Usuario) => void;
}

export const ListaAlunos = ({ isAdmin, usuarios, setUsuarios, onEdit }: ListaAlunosProps) => {

    const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
    const [idParaDeletar, setIdParaDeletar] = useState<string | null>(null);

    const handleButtonDelete = (id: string) => {
        setIsOpenModalDelete(true);
        setIdParaDeletar(id);
    };

    // DELETE retorna void; o feedback de sucesso/erro e dado no front via alert.
    const onClickSimModalDelete = async () => {
        if (idParaDeletar === null) return;

        try {
            await deleteUsuarioById(idParaDeletar);
            setUsuarios(usuarios.filter((usuario) => usuario.id !== idParaDeletar));
            setIsOpenModalDelete(false);
            setIdParaDeletar(null);
            alert("Aluno excluído com sucesso!!!");
        } catch (error) {
            console.error("Erro ao deletar aluno: ", error);
            alert(extrairMensagemErro(error, "Não foi possível excluir o aluno. Tente novamente."));
        }
    }

    if (usuarios.length === 0) {
        return (
            <div className="w-full max-w-6xl bg-white rounded-2xl shadow-md p-6 text-center text-gray-500">
                Nenhum aluno encontrado.
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col items-center">
            {isOpenModalDelete && (
                <ModalDelete
                    setIsOpenModalDelete={setIsOpenModalDelete}
                    msg="Deseja realmente excluir esse aluno?"
                    onClickSim={onClickSimModalDelete}
                />
            )}

            {/* Responsividade mobile: cards empilhados (visivel apenas abaixo de md) */}
            <div className="w-full max-w-6xl flex flex-col gap-4 md:hidden">
                {usuarios.map((usuario, index) => (
                    <div
                        key={usuario.id ?? index}
                        className="bg-white rounded-2xl shadow-md p-4 flex flex-col gap-2"
                    >
                        <div className="flex justify-between items-center gap-2">
                            <h3 className="text-lg font-bold text-gray-800">{usuario.nome}</h3>
                            <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-medium">
                                {usuario.role}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600">Idade: {usuario.idade}</p>
                        <p className="text-sm text-gray-600">Sexo: {usuario.sexo}</p>
                        <p className="text-sm text-gray-600">Login: {usuario.login}</p>

                        {isAdmin && (
                            <div className="flex flex-row gap-2 mt-2">
                                <button
                                    onClick={() => onEdit(usuario)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleButtonDelete(usuario.id ?? "")}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                >
                                    Excluir
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Desktop: tabela no mesmo padrao visual das demais telas (visivel a partir de md) */}
            <div className="hidden md:block w-full max-w-6xl overflow-x-auto">
                <table className="table-auto bg-white min-w-max w-full rounded-2xl shadow-md">
                    <thead>
                        <tr className="border-b border-gray-200 text-gray-700">
                            <th className="p-4 text-center">Nome</th>
                            <th className="p-4 text-center">Idade</th>
                            <th className="p-4 text-center">Sexo</th>
                            <th className="p-4 text-center">Login</th>
                            <th className="p-4 text-center">Perfil</th>
                            {isAdmin && <th className="p-4 text-center">Ações</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {usuarios.map((usuario, index) => (
                            <tr key={usuario.id ?? index} className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">{usuario.nome}</td>
                                <td className="p-2">{usuario.idade}</td>
                                <td className="p-2">{usuario.sexo}</td>
                                <td className="p-2">{usuario.login}</td>
                                <td className="p-2">{usuario.role}</td>
                                {isAdmin && (
                                    <td className="p-2">
                                        <button
                                            onClick={() => onEdit(usuario)}
                                            className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleButtonDelete(usuario.id ?? "")}
                                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
