import { useState } from "react";
import { BotaoVoltar } from "../components/BotaoVoltar";
import { ExerciciosTab } from "../components/treinos/ExerciciosTab";
import { TreinosTab } from "../components/treinos/TreinosTab";
import { getTokenDecoded } from "../utils/Auth";

type AbaTreinamentos = "TREINOS" | "EXERCICIOS";

export const TreinosPage = () => {

    const [isAdmin] = useState<boolean>(() => getTokenDecoded()?.role === "ADMIN");
    const [abaAtiva, setAbaAtiva] = useState<AbaTreinamentos>("TREINOS");

    const abas: { valor: AbaTreinamentos; label: string }[] = isAdmin
        ? [
            { valor: "TREINOS", label: "Treinos" },
            { valor: "EXERCICIOS", label: "Exercícios" },
        ]
        : [{ valor: "TREINOS", label: "Treinos" }];

    return (
        <div className="mt-2 flex min-h-screen w-full flex-col items-center overflow-y-auto pb-60">
            <BotaoVoltar />
            <h1 className="mb-4 text-2xl font-semibold text-gray-800">Treinamentos</h1>

            <div className="flex w-full max-w-6xl flex-col gap-4">
                <div className="rounded-2xl bg-white p-1.5 shadow-md">
                    <div className="flex gap-1">
                        {abas.map((aba) => {
                            const ativa = aba.valor === abaAtiva;

                            return (
                                <button
                                    key={aba.valor}
                                    type="button"
                                    onClick={() => setAbaAtiva(aba.valor)}
                                    className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors sm:flex-none sm:px-8 ${
                                        ativa
                                            ? "bg-blue-700 text-white"
                                            : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                                    }`}
                                >
                                    {aba.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {abaAtiva === "EXERCICIOS" && isAdmin ? (
                    <ExerciciosTab />
                ) : (
                    <TreinosTab isAdmin={isAdmin} />
                )}
            </div>
        </div>
    );
};
