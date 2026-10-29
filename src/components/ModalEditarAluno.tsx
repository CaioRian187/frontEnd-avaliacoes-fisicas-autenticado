import React, { useEffect, useState } from "react";
import { Input } from "./Input";
import { updateUsuario } from "../services/UsuarioService";
import type { Usuario } from "../interfaces/Usuario";
import type { UsuarioUpdateRequest } from "../interfaces/UsuarioRequest";
import { GENERO_OPTIONS, type GeneroEnum } from "../interfaces/Genero";
import { useFeedbackModal } from "../hooks/useFeedbackModal";
import { CampoListaStrings } from "./CampoListaStrings";
import { listasObrigatoriasValidas } from "../utils/ListaStrings";

interface ModalEditarAlunoProps {
    usuario: Usuario;
    usuarios: Usuario[];
    setUsuarios: (usuarios: Usuario[]) => void;
    onClose: () => void;
    titulo?: string;
}

const ModalEditarAlunoForm = ({ usuario, usuarios, setUsuarios, onClose, titulo = "Editar Aluno" }: ModalEditarAlunoProps) => {

    const { showSuccess, showWarning, showError } = useFeedbackModal();
    const [nome, setNome] = useState(usuario.nome ?? "");
    const [idade, setIdade] = useState<number | string>(usuario.idade ?? "");
    const [genero, setGenero] = useState<GeneroEnum | "">(usuario.genero ?? "");
    const [deficiencias, setDeficiencias] = useState<string[]>(usuario.deficiencias ?? []);
    const [lezoes, setLezoes] = useState<string[]>(usuario.lezoes ?? []);

    // Sincroniza os campos caso o aluno selecionado para edicao mude.
    useEffect(() => {
        setNome(usuario.nome ?? "");
        setIdade(usuario.idade ?? "");
        setGenero(usuario.genero ?? "");
        setDeficiencias(usuario.deficiencias ?? []);
        setLezoes(usuario.lezoes ?? []);
    }, [usuario]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nome || idade === "" || !genero) {
            showWarning("Por favor, preencha todos os campos!");
            return;
        }

        if (!listasObrigatoriasValidas(deficiencias, lezoes)) {
            showWarning("Responda as perguntas sobre deficiência e lesão ou adicione ao menos um item em cada uma.");
            return;
        }

        if (!usuario.id) {
            showError("Usuário inválido. Não foi possível atualizar os dados.");
            return;
        }

        const request: UsuarioUpdateRequest = {
            nome: nome,
            idade: Number(idade),
            genero: genero,
            deficiencias: deficiencias,
            lezoes: lezoes,
        };

        try {
            const atualizado = await updateUsuario(usuario.id, request);
            setUsuarios(usuarios.map((item) => (item.id === atualizado.id ? atualizado : item)));
            onClose();
            showSuccess("Aluno atualizado com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar aluno: ", error);
            showError("Falha ao atualizar o aluno. Verifique os dados inseridos.");
        }
    }

    return (
        // Overlay no mesmo padrao visual do ModalDelete
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <form
                    onSubmit={handleSubmit}
                    className="w-full h-auto flex flex-col items-center justify-center gap-6 bg-white shadow-md rounded-2xl p-4 md:p-8"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{titulo}</h2>

                    <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">

                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-lg font-medium text-slate-700">Nome</label>
                                <Input
                                    classname="w-full px-4 py-2.5 rounded-lg border-2 border-blue-200"
                                    type="text"
                                    placeholder="Informe o nome do aluno"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-lg font-medium text-slate-700">Idade</label>
                                <Input
                                    classname="w-full px-4 py-2.5 rounded-lg border-2 border-blue-200"
                                    type="number"
                                    placeholder="Informe a idade do aluno"
                                    value={idade}
                                    onChange={(e) => setIdade(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-lg font-medium text-slate-700">Gênero</label>
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

                            <div className="flex flex-col gap-1.5">
                                <label className="text-lg font-medium text-slate-700">Login (não editável)</label>
                                <input
                                    className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 bg-gray-100 text-gray-500"
                                    value={usuario.login ?? ""}
                                    disabled
                                    readOnly
                                />
                            </div>
                        </div>

                    </div>

                    <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-6 items-start border-t border-gray-200 pt-5">
                        <CampoListaStrings
                            key={`deficiencias-${usuario.id ?? "novo"}`}
                            pergunta="Possui alguma deficiência?"
                            placeholder="Descreva a deficiência"
                            valores={deficiencias}
                            onChange={setDeficiencias}
                        />

                        <CampoListaStrings
                            key={`lezoes-${usuario.id ?? "novo"}`}
                            pergunta="Possui alguma lesão?"
                            placeholder="Descreva a lesão"
                            valores={lezoes}
                            onChange={setLezoes}
                        />
                    </div>

                    {/* Responsividade: botoes empilham em mobile e voltam a row a partir de sm */}
                    <div className="w-full max-w-3xl flex flex-col sm:flex-row gap-4">
                        <button
                            type="submit"
                            className="w-full px-3 py-2 rounded-md bg-blue-700 text-white hover:bg-blue-600"
                        >
                            Salvar Alterações
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full px-3 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Remonta o formulario inteiro quando o usuario em edicao muda. Isso evita que
// estados internos (ex: resposta Sim/Nao do CampoListaStrings) fiquem presos aos
// dados do usuario anterior enquanto o useEffect de sincronizacao ainda nao rodou.
export const ModalEditarAluno = (props: ModalEditarAlunoProps) => (
    <ModalEditarAlunoForm key={props.usuario.id ?? "novo"} {...props} />
);
