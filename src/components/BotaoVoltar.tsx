import { useNavigate } from "react-router-dom";

interface BotaoVoltarProps {
    to?: string;
}

// Botao de navegacao fixo no topo-esquerdo, no mesmo padrao visual das demais telas.
export const BotaoVoltar = ({ to = "/home" }: BotaoVoltarProps) => {

    const navigate = useNavigate();

    return (
        <button
            type="button"
            onClick={() => navigate(to)}
            className="fixed top-4 left-4 z-40 flex items-center gap-1 bg-white text-blue-700 font-semibold px-3 py-2 rounded-2xl shadow-md hover:bg-blue-50 transition-colors"
        >
            <span aria-hidden="true">←</span>
            Voltar
        </button>
    );
}
