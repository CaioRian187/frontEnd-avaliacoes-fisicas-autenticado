import { useEffect, useState } from "react";
import { getTokenDecoded } from "../utils/Auth";
import { ListaCircunferencias } from "../components/ListaCircunferencias";
import { findAllCircunferenciasByAlunoId } from "../services/CircunferenciaService";
import type { Circunferencia } from "../interfaces/Circunferencia";
import { FormCircunferencias } from "../components/FormCircunferencias";
import type { Usuario } from "../interfaces/Usuario";
import { findAllUsuariosProjetions } from "../services/UsuarioService";
import { BotaoVoltar } from "../components/BotaoVoltar";

export const CircunferenciasPage = () => {

    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [circunferencias, setCircunferencias] = useState<Circunferencia[]>([]);
    // Estado de usuarios mantido apenas para o setter; valor nunca lido (TS6133)
    const [, setUsuarios] = useState<Usuario[]>([]);
    const [idAndNomeUsuarios, setIdAndNomeUsuarios] = useState<{ id: string; nome: string }[]>([]);


    const carregarCircunferencias = async (alunoId: string) => {
        try {
            const lista = await findAllCircunferenciasByAlunoId(alunoId);
            setCircunferencias(lista);
        } catch (error) {
            console.error("Erro ao carregar circunferências: ", error);
            alert("Não foi possível carregar as circunferências.");
        }
    }

    useEffect(() => {
        const loadCircunferencias = async () => {
            try {
                const tokenDecoded = getTokenDecoded();

                if (!tokenDecoded) {
                    alert("Token não encontrado.");
                    return;
                }

                const alunoId = tokenDecoded?.id;

                if (!alunoId) {
                    alert("Aluno ID não encontrado no token decodificado.");
                    return;
                }

                await carregarCircunferencias(alunoId);


                const listUsuariosProjetions = await findAllUsuariosProjetions();
                setUsuarios(listUsuariosProjetions);


                if (tokenDecoded.role === "ADMIN") {
                    handleListIdAndNomeUsuarios(listUsuariosProjetions);
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            } catch (error) {
                console.error(error);
            }
        };

        loadCircunferencias();
    }, [])


    const handleListIdAndNomeUsuarios = (list: Usuario[]) => {
        const idAndNomeList = list.map((usuario) => ({
            id: usuario?.id || "",
            nome: usuario?.nome || "",
        }));
        setIdAndNomeUsuarios(idAndNomeList);
        return idAndNomeList;
    }

    // Dispara a busca das circunferências sempre que o ADMIN seleciona outro aluno.
    const handleSelecionarAluno = async (alunoId: string) => {
        if (!alunoId) return;
        await carregarCircunferencias(alunoId);
    }


    return (
        <div className="mt-2 flex flex-col items-center w-full min-h-screen overflow-y-auto pb-60">
            <BotaoVoltar />
            <h1 className="mb-4 text-2xl text-gray-800 font-semibold">Circunferências</h1>

            {isAdmin && <FormCircunferencias
                idAndNomeUsuarios={idAndNomeUsuarios}
                circunferencias={circunferencias}
                setCircunferencias={setCircunferencias}
            />}

            <ListaCircunferencias
                isAdmin={isAdmin}
                idAndNomeUsuarios={idAndNomeUsuarios}
                circunferencias={circunferencias}
                setCircunferencias={setCircunferencias}
                onSelecionarAluno={handleSelecionarAluno} />
        </div>
    );

}