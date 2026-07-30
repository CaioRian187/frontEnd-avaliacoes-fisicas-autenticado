import { useEffect, useState } from "react";
import { getTokenDecoded } from "../utils/Auth";
import { ListaCircunferencias } from "../components/ListaCircunferencias";
import { findAllCircunferenciasByAlunoId } from "../services/CircunferenciaService";
import type { Circunferencia } from "../interfaces/Circunferencia";
import { FormCircunferencias } from "../components/FormCircunferencias";
import type { Usuario } from "../interfaces/Usuario";
import { findAllUsuariosProjetions } from "../services/UsuarioService";

export const CircunferenciasPage = () => {

    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [circunferencias, setCircunferencias] = useState<Circunferencia[]>([]);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [idAndNomeUsuarios, setIdAndNomeUsuarios] = useState<{ id: string; nome: string }[]>([]);


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

                const listCircunferencias = await findAllCircunferenciasByAlunoId(alunoId);
                setCircunferencias(listCircunferencias);


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


    return (
        <div className="mt-3 flex flex-col items-center justify-center min-h-screen">
            <h1 className="mb-4 text-2xl text-gray-800 font-semibold">Circunferências</h1>

            {isAdmin && <FormCircunferencias
                idAndNomeUsuarios={idAndNomeUsuarios}
                circunferencias={circunferencias}
                setCircunferencias={setCircunferencias}
            />}

            <ListaCircunferencias
                isAdmin={isAdmin}
                circunferencias={circunferencias}
                setCircunferencias={setCircunferencias} />
        </div>
    );

}