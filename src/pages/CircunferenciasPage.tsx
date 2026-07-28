import { useEffect, useState } from "react";
import { getTokenDecoded } from "../utils/Auth";
import { ListaCircunferencias } from "../components/ListaCircunferencias";


export const CircunferenciasPage = () => {

    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    useEffect(() => {
        try {
            const tokenDecod = getTokenDecoded();
            if (tokenDecod?.role === "ADMIN") {
                setIsAdmin(true)
            }
            else {
                setIsAdmin(false);
            }
        } catch (error) {
            console.error(error)
        }
    }, [])


    return (
        <div className="mt-3 flex flex-col items-center justify-center min-h-screen">
            <h1 className="mb-4 text-2xl text-gray-800 font-semibold">Circunferências</h1>
            {isAdmin ? (
                <div>Conteúdo de administrador</div>
            ) : (
                <div>
                    <ListaCircunferencias isAdmin={isAdmin} />
                </div>
            )}
        </div>
    );

}