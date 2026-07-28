import { useEffect, useState } from "react";
import { getTokenDecoded } from "../utils/Auth";
import { ListaCircunferencias } from "../components/ListaCircunferencias";
import { findAllCircunferenciasByAlunoId } from "../services/CircunferenciaService";
import type { Circunferencia } from "../interfaces/Circunferencia";

export const CircunferenciasPage = () => {

    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [circunferencias, setCircunferencias] = useState<Circunferencia[]>([]);


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

                const response = await findAllCircunferenciasByAlunoId(alunoId);
                setCircunferencias(response);
                console.log("Circunferências recebidas:", response);

                if (tokenDecoded.role === "ADMIN") {
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


    return (
        <div className="mt-3 flex flex-col items-center justify-center min-h-screen">
            <h1 className="mb-4 text-2xl text-gray-800 font-semibold">Circunferências</h1>
            <ListaCircunferencias
                isAdmin={isAdmin}
                circunferencias={circunferencias}
                setCircunferencias={setCircunferencias} />
        </div>
    );

}