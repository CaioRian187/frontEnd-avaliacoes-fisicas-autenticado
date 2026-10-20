import { useEffect, useState } from "react";
import { getTokenDecoded } from "../utils/Auth";
import { findAllDobrasByAlunoId } from "../services/DobraService";
import { findAllUsuariosProjetions } from "../services/UsuarioService";
import type { DobraCutanea } from "../interfaces/DobraCutanea";
import type { Usuario } from "../interfaces/Usuario";
import { FormDobras } from "../components/FormDobras";
import { ListaDobras } from "../components/ListaDobras";
import { ModalEditarDobra } from "../components/ModalEditarDobra";
import { BotaoVoltar } from "../components/BotaoVoltar";
import { useFeedbackModal } from "../hooks/useFeedbackModal";

export const DobrasPage = () => {

    const { showError } = useFeedbackModal();
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [dobras, setDobras] = useState<DobraCutanea[]>([]);
    const [idAndNomeUsuarios, setIdAndNomeUsuarios] = useState<{ id: string; nome: string }[]>([]);
    const [dobraEmEdicao, setDobraEmEdicao] = useState<DobraCutanea | null>(null);

    const carregarDobras = async (alunoId: string) => {
        try {
            const lista = await findAllDobrasByAlunoId(alunoId);
            setDobras(lista);
        } catch (error) {
            console.error("Erro ao carregar dobras cutâneas: ", error);
            showError("Não foi possível carregar as dobras cutâneas.");
        }
    }

    const handleListIdAndNomeUsuarios = (list: Usuario[]) => {
        const idAndNomeList = list.map((usuario) => ({
            id: usuario?.id || "",
            nome: usuario?.nome || "",
        }));
        setIdAndNomeUsuarios(idAndNomeList);
        return idAndNomeList;
    }

    useEffect(() => {
        const loadDobras = async () => {
            try {
                const tokenDecoded = getTokenDecoded();

                if (!tokenDecoded) {
                    return;
                }

                const alunoId = tokenDecoded.id;

                if (!alunoId) {
                    showError("Aluno ID não encontrado no token decodificado.");
                    return;
                }

                if (tokenDecoded.role === "ADMIN") {
                    const listUsuariosProjetions = await findAllUsuariosProjetions();
                    handleListIdAndNomeUsuarios(listUsuariosProjetions);
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }

                await carregarDobras(alunoId);
            } catch (error) {
                console.error(error);
            }
        };

        loadDobras();
    }, []);

    const handleSelecionarAluno = async (alunoId: string) => {
        if (!alunoId) return;
        await carregarDobras(alunoId);
    }

    return (
        <div className="mt-2 flex flex-col items-center w-full min-h-screen overflow-y-auto pb-60">
            <BotaoVoltar />
            <h1 className="mb-4 text-2xl text-gray-800 font-semibold">Dobras Cutâneas</h1>

            {isAdmin && <FormDobras
                idAndNomeUsuarios={idAndNomeUsuarios}
                dobras={dobras}
                setDobras={setDobras}
            />}

            {isAdmin && dobraEmEdicao && (
                <ModalEditarDobra
                    dobra={dobraEmEdicao}
                    dobras={dobras}
                    setDobras={setDobras}
                    idAndNomeUsuarios={idAndNomeUsuarios}
                    onClose={() => setDobraEmEdicao(null)}
                />
            )}

            <ListaDobras
                isAdmin={isAdmin}
                idAndNomeUsuarios={idAndNomeUsuarios}
                dobras={dobras}
                setDobras={setDobras}
                onEdit={setDobraEmEdicao}
                onSelecionarAluno={handleSelecionarAluno}
            />
        </div>
    );
}
