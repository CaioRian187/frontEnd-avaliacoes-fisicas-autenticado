import { logError } from "../utils/logger";
import { useCallback, useEffect, useState } from "react";
import { getTokenDecoded } from "../utils/Auth";
import { ListaCircunferencias } from "../components/ListaCircunferencias";
import { findAllCircunferenciasByAlunoId } from "../services/CircunferenciaService";
import type { Circunferencia } from "../interfaces/Circunferencia";
import { FormCircunferencias } from "../components/FormCircunferencias";
import { ModalEditarCircunferencia } from "../components/ModalEditarCircunferencia";
import type { Usuario } from "../interfaces/Usuario";
import { findAllUsuariosProjetions } from "../services/UsuarioService";
import { BotaoVoltar } from "../components/BotaoVoltar";
import { useFeedbackModal } from "../hooks/useFeedback";

export const CircunferenciasPage = () => {

    const { showError } = useFeedbackModal();
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [circunferencias, setCircunferencias] = useState<Circunferencia[]>([]);
    const [idAndNomeUsuarios, setIdAndNomeUsuarios] = useState<{ id: string; nome: string }[]>([]);
    const [circunferenciaEmEdicao, setCircunferenciaEmEdicao] = useState<Circunferencia | null>(null);


    const carregarCircunferencias = useCallback(async (alunoId: string) => {
        try {
            const lista = await findAllCircunferenciasByAlunoId(alunoId);
            setCircunferencias(lista);
        } catch (error) {
            logError("Erro ao carregar circunferências: ", error);
            showError("Não foi possível carregar as circunferências.");
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
        const loadCircunferencias = async () => {
            try {
                const tokenDecoded = getTokenDecoded();

                if (!tokenDecoded) {
                    showError("Token não encontrado.");
                    return;
                }

                const alunoId = tokenDecoded?.id;

                if (!alunoId) {
                    showError("Aluno ID não encontrado no token decodificado.");
                    return;
                }

                await carregarCircunferencias(alunoId);

                if (tokenDecoded.role === "ADMIN") {
                    const listUsuariosProjetions = await findAllUsuariosProjetions();
                    handleListIdAndNomeUsuarios(listUsuariosProjetions);
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            } catch (error) {
                logError(error);
            }
        };

        loadCircunferencias();
    }, [carregarCircunferencias, handleListIdAndNomeUsuarios, showError])

    // Dispara a busca das circunferências sempre que o ADMIN seleciona outro aluno.
    const handleSelecionarAluno = async (alunoId: string) => {
        if (!alunoId) return;
        await carregarCircunferencias(alunoId);
    }


    return (
        <div className="mt-2 flex flex-col items-center w-full py-6">
            <BotaoVoltar />
            <h1 className="mb-4 text-2xl text-gray-800 font-semibold">Circunferências</h1>

            {isAdmin && <FormCircunferencias
                idAndNomeUsuarios={idAndNomeUsuarios}
                circunferencias={circunferencias}
                setCircunferencias={setCircunferencias}
            />}

            {isAdmin && circunferenciaEmEdicao && (
                <ModalEditarCircunferencia
                    circunferencia={circunferenciaEmEdicao}
                    circunferencias={circunferencias}
                    setCircunferencias={setCircunferencias}
                    idAndNomeUsuarios={idAndNomeUsuarios}
                    onClose={() => setCircunferenciaEmEdicao(null)}
                />
            )}

            <ListaCircunferencias
                isAdmin={isAdmin}
                idAndNomeUsuarios={idAndNomeUsuarios}
                circunferencias={circunferencias}
                setCircunferencias={setCircunferencias}
                onSelecionarAluno={handleSelecionarAluno}
                onEdit={setCircunferenciaEmEdicao} />
        </div>
    );

}