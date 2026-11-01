import { logError } from "../utils/logger";
import { useCallback, useEffect, useState } from "react";
import { findAllDobrasByAlunoId } from "../services/DobraService";
import { findAllUsuariosProjetions } from "../services/UsuarioService";
import type { DobraCutanea } from "../interfaces/DobraCutanea";
import type { Usuario } from "../interfaces/Usuario";
import { FormDobras } from "../components/FormDobras";
import { ListaDobras } from "../components/ListaDobras";
import { ModalEditarDobra } from "../components/ModalEditarDobra";
import { BotaoVoltar } from "../components/BotaoVoltar";
import { useFeedbackModal } from "../hooks/useFeedback";
import { useAuth } from "../hooks/useAuth";

export const DobrasPage = () => {

    const { user, isAdmin } = useAuth();
    const { showError } = useFeedbackModal();
    const [dobras, setDobras] = useState<DobraCutanea[]>([]);
    const [idAndNomeUsuarios, setIdAndNomeUsuarios] = useState<{ id: string; nome: string }[]>([]);
    const [dobraEmEdicao, setDobraEmEdicao] = useState<DobraCutanea | null>(null);

    const carregarDobras = useCallback(async (alunoId: string) => {
        try {
            const lista = await findAllDobrasByAlunoId(alunoId);
            setDobras(lista);
        } catch (error) {
            logError("Erro ao carregar dobras cutâneas: ", error);
            showError("Não foi possível carregar as dobras cutâneas.");
        }
    }, [showError]);

    const handleListIdAndNomeUsuarios = useCallback((list: Usuario[]) => {
        const idAndNomeList = list.map((usuario) => ({
            id: usuario?.id || "",
            nome: usuario?.nome || "",
        }));
        setIdAndNomeUsuarios(idAndNomeList);
        return idAndNomeList;
    }, []);

    useEffect(() => {
        const loadDobras = async () => {
            try {
                const alunoId = user?.id;

                if (!alunoId) {
                    return;
                }

                if (isAdmin) {
                    const listUsuariosProjetions = await findAllUsuariosProjetions();
                    handleListIdAndNomeUsuarios(listUsuariosProjetions);
                }

                await carregarDobras(alunoId);
            } catch (error) {
                logError(error);
            }
        };

        loadDobras();
    }, [carregarDobras, handleListIdAndNomeUsuarios, isAdmin, user]);

    const handleSelecionarAluno = async (alunoId: string) => {
        if (!alunoId) return;
        await carregarDobras(alunoId);
    }

    return (
        <div className="mt-2 flex flex-col items-center w-full py-6">
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
