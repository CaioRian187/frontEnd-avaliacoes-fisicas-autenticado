import { useId, useState, type KeyboardEvent } from "react";
import { LISTA_NAO } from "../utils/ListaStrings";

interface CampoListaStringsProps {
    pergunta: string;
    placeholder: string;
    valores: string[];
    onChange: (valores: string[]) => void;
}

type Resposta = "sim" | "nao" | null;

const obterRespostaInicial = (valores: string[]): Resposta => {
    if (valores.length === 0) return null;

    return valores.some((valor) => valor !== LISTA_NAO) ? "sim" : "nao";
};

export const CampoListaStrings = ({ pergunta, placeholder, valores, onChange }: CampoListaStringsProps) => {
    const grupoId = useId();
    const inputId = useId();
    const [resposta, setResposta] = useState<Resposta>(() => obterRespostaInicial(valores));
    const [novoValor, setNovoValor] = useState<string>("");

    const selecionarNao = () => {
        setResposta("nao");
        setNovoValor("");
        onChange([LISTA_NAO]);
    };

    const selecionarSim = () => {
        setResposta("sim");

        const itens = valores.filter((valor) => valor !== LISTA_NAO);
        if (itens.length !== valores.length) {
            onChange(itens);
        }
    };

    const adicionarValor = () => {
        const valor = novoValor.trim();

        if (!valor) return;
        if (valores.some((item) => item.toLowerCase() === valor.toLowerCase())) return;

        onChange([...valores, valor]);
        setNovoValor("");
    };

    const removerValor = (indice: number) => {
        onChange(valores.filter((_, posicao) => posicao !== indice));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter") return;

        e.preventDefault();
        adicionarValor();
    };

    const classeOpcao = (selecionada: boolean) =>
        `cursor-pointer px-6 py-2 rounded-lg border-2 font-medium transition-colors focus-within:ring-2 focus-within:ring-blue-400 ${
            selecionada
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-blue-200 bg-white text-slate-700 hover:bg-blue-50"
        }`;

    return (
        <div className="flex flex-col gap-3">
            <span id={`${grupoId}-label`} className="text-lg font-medium text-slate-700">
                {pergunta}
            </span>

            <div className="flex flex-wrap gap-3" role="radiogroup" aria-labelledby={`${grupoId}-label`}>
                <label className={classeOpcao(resposta === "nao")}>
                    <input
                        type="radio"
                        name={grupoId}
                        className="sr-only"
                        checked={resposta === "nao"}
                        onChange={selecionarNao}
                    />
                    Não
                </label>

                <label className={classeOpcao(resposta === "sim")}>
                    <input
                        type="radio"
                        name={grupoId}
                        className="sr-only"
                        checked={resposta === "sim"}
                        onChange={selecionarSim}
                    />
                    Sim
                </label>
            </div>

            {resposta === "sim" && (
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <label htmlFor={inputId} className="sr-only">
                            {placeholder}
                        </label>
                        <input
                            id={inputId}
                            className="w-full px-4 py-2.5 rounded-lg border-2 border-blue-200"
                            type="text"
                            placeholder={placeholder}
                            value={novoValor}
                            onChange={(e) => setNovoValor(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            type="button"
                            onClick={adicionarValor}
                            disabled={!novoValor.trim()}
                            className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Adicionar
                        </button>
                    </div>

                    {valores.length === 0 ? (
                        <p className="text-sm text-amber-700">
                            Adicione ao menos um item ou selecione a opção "Não".
                        </p>
                    ) : (
                        <ul className="flex flex-wrap gap-2">
                            {valores.map((valor, indice) => (
                                <li
                                    key={`${valor}-${indice}`}
                                    className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                                >
                                    <span>{valor}</span>
                                    <button
                                        type="button"
                                        onClick={() => removerValor(indice)}
                                        aria-label={`Remover ${valor}`}
                                        className="rounded-full px-1 text-blue-700 hover:bg-blue-200"
                                    >
                                        ✕
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};
