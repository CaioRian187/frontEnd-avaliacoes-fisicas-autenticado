import { useEffect } from "react";
import { converterData } from "../utils/ConverterData";
import type { Circunferencia } from "../interfaces/Circunferencia";

interface CircunferenciaProps {
    isAdmin: boolean;
    circunferencias: Circunferencia[];
    setCircunferencias: (circunferencias: Circunferencia[]) => void;
}

export const ListaCircunferencias = ({ isAdmin, circunferencias, setCircunferencias }: CircunferenciaProps) => {

    /*
    const [data, setData] = useState<string>("");
    const [altura, setAltura] = useState<number | string>("");
    const [peso, setPeso] = useState<number | string>("");
    const [ombro, setOmbro] = useState<number | string>("");
    const [cintura, setCintura] = useState<number | string>("");
    const [quadril, setQuadril] = useState<number | string>("");
    const [peitoral, setPeitoral] = useState<number | string>("");
    const [abdomen, setAbdomen] = useState<number | string>("");
    const [coxaProximalEsquerda, setCoxaProximalEsquerda] = useState<number | string>("");
    const [coxaProximalDireita, setCoxaProximalDireita] = useState<number | string>("");
    const [coxaMedialEsquerda, setCoxaMedialEsquerda] = useState<number | string>("");
    const [coxaMedialDireita, setCoxaMedialDireita] = useState<number | string>("");
    const [coxaDistalEsquerda, setCoxaDistalEsquerda] = useState<number | string>("");
    const [coxaDistalDireita, setCoxaDistalDireita] = useState<number | string>("");
    const [panturrilhaEsquerda, setPanturrilhaEsquerda] = useState<number | string>("");
    const [panturrilhaDireita, setPanturrilhaDireita] = useState<number | string>("");
    const [bracoRelaxadoEsquerdo, setBracoRelaxadoEsquerdo] = useState<number | string>("");
    const [bracoRelaxadoDireito, setBracoRelaxadoDireito] = useState<number | string>("");
    const [bracoContraidoEsquerdo, setBracoContraidoEsquerdo] = useState<number | string>("");
    const [bracoContraidoDireito, setBracoContraidoDireito] = useState<number | string>("");
    const [antebracoEsquerdo, setAntebracoEsquerdo] = useState<number | string>("");
    const [antebracoDireito, setAntebracoDireito] = useState<number | string>("");
    const [alunoId, setAlunoId] = useState<string>("");

    */

    useEffect(() => {
        const getCircunferencias = async () => {
            try {
                // Ordenando por data crescente para a comparação de diferença fazer sentido
                const ordenadas = [...circunferencias].sort((a, b) =>
                    new Date(a.data || 0).getTime() - new Date(b.data || 0).getTime()
                );
                setCircunferencias(ordenadas);
            } catch (error) {
                console.error("Erro ao buscar circunferências:", error);
            }
        };
        getCircunferencias();
    }, []);

    const renderDiferenca = (index: number, campo: keyof Circunferencia) => {
        if (index === 0) return null;

        const valorAtual = circunferencias[index][campo] as number | undefined;
        const valorAnterior = circunferencias[index - 1][campo] as number | undefined;

        if (valorAtual === undefined || valorAnterior === undefined || valorAtual === null || valorAnterior === null) return null;

        const diferenca = Number((valorAtual - valorAnterior).toFixed(1));
        if (diferenca === 0) return null;

        return (
            <span
                className={`text-xs ml-1.5 px-1.5 py-0.5 rounded font-medium ${diferenca > 0
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                    }
                `}
            >
                {diferenca > 0 ? `+${diferenca}` : diferenca}
            </span>
        );
    }

    return (
        <div>
            {isAdmin ? (
                <div className="px-4 w-full max-w-7xl overflow-x-auto">
                    <table className="table-auto bg-white w-full rounded-2xl shadow-md">
                        <thead>
                            <tr className="border-b border-gray-200 text-gray-700 p-2">
                                <th className="p-4 text-center">Medidas</th>
                                {circunferencias.map((circunferencia) => (
                                    <th
                                        className="p-4 text-center"
                                        key={circunferencia.id}>
                                        {converterData(circunferencia.data || "")}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Ações</td>
                                {circunferencias.map((circunferencia) => (
                                    <td
                                        className="p-2"
                                        key={circunferencia.id}
                                    >
                                        <button
                                            className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600">
                                            Editar
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                                            Excluir
                                        </button>
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Altura</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.altura}
                                        {renderDiferenca(index, "altura")}
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Peso</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.peso}
                                        {renderDiferenca(index, "peso")}
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">IMC</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.imc}
                                        {renderDiferenca(index, "imc")}
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Ombro</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.ombro}
                                        {renderDiferenca(index, "ombro")}
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Cintura</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.cintura}
                                        {renderDiferenca(index, "cintura")}
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Quadril</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.quadril}
                                        {renderDiferenca(index, "quadril")}
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Peitoral</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.peitoral}
                                        {renderDiferenca(index, "peitoral")}
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Abdomen</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.abdomen}
                                        {renderDiferenca(index, "abdomen")}
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Coxa Proximal Esquerda</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.coxaProximalEsquerda}
                                        {renderDiferenca(index, "coxaProximalEsquerda")}
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Coxa Proximal Direita</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.coxaProximalDireita}
                                        {renderDiferenca(index, "coxaProximalDireita")}
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Coxa Medial Esquerda</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.coxaMedialEsquerda}
                                        {renderDiferenca(index, "coxaMedialEsquerda")}
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Coxa Medial Direita</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.coxaMedialDireita}
                                        {renderDiferenca(index, "coxaMedialDireita")}
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Coxa Distal Esquerda</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.coxaDistalEsquerda}
                                        {renderDiferenca(index, "coxaDistalEsquerda")}
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Coxa Distal Direita</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.coxaDistalDireita}
                                        {renderDiferenca(index, "coxaDistalDireita")}
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Panturrilha Esquerda</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.panturrilhaEsquerda}
                                        {renderDiferenca(index, "panturrilhaEsquerda")}
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Panturrilha Direita</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.panturrilhaDireita}
                                        {renderDiferenca(index, "panturrilhaDireita")}
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Braço Relaxado Esquerdo</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.bracoRelaxadoEsquerdo}
                                        {renderDiferenca(index, "bracoRelaxadoEsquerdo")}
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Braço Relaxado Direito</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.bracoRelaxadoDireito}
                                        {renderDiferenca(index, "bracoRelaxadoDireito")}
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Braço Contraído Esquerdo</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.bracoContraidoEsquerdo}
                                        {renderDiferenca(index, "bracoContraidoEsquerdo")}
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Braço Contraído Direito</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.bracoContraidoDireito}
                                        {renderDiferenca(index, "bracoContraidoDireito")}
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Antebraço Esquerdo</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.antebraçoEsquerdo}
                                        {renderDiferenca(index, "antebraçoEsquerdo")}
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Antebraço Direito</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.antebraçoDireito}
                                        {renderDiferenca(index, "antebraçoDireito")}
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            ) : (

                <div className="px-4 w-full max-w-7xl overflow-x-auto">
                    <table className="table-auto bg-white w-full rounded-2xl shadow-md">
                        <thead>
                            <tr className="border-b border-gray-200 text-gray-700 p-2">
                                <th className="p-4 text-center">Medidas</th>
                                {circunferencias.map((circunferencia) => (
                                    <th
                                        className="p-4 text-center"
                                        key={circunferencia.id}>
                                        {converterData(circunferencia.data || "")}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Altura</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.altura}
                                        {renderDiferenca(index, "altura")}
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Peso</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.peso}
                                        {renderDiferenca(index, "peso")}
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">IMC</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.imc}
                                        {renderDiferenca(index, "imc")}
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Ombro</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.ombro}
                                        {renderDiferenca(index, "ombro")}
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Cintura</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.cintura}
                                        {renderDiferenca(index, "cintura")}
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Quadril</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.quadril}
                                        {renderDiferenca(index, "quadril")}
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Peitoral</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.peitoral}
                                        {renderDiferenca(index, "peitoral")}
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Abdomen</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.abdomen}
                                        {renderDiferenca(index, "abdomen")}
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Coxa Proximal Esquerda</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.coxaProximalEsquerda}
                                        {renderDiferenca(index, "coxaProximalEsquerda")}
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Coxa Proximal Direita</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.coxaProximalDireita}
                                        {renderDiferenca(index, "coxaProximalDireita")}
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Coxa Medial Esquerda</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.coxaMedialEsquerda}
                                        {renderDiferenca(index, "coxaMedialEsquerda")}
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Coxa Medial Direita</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.coxaMedialDireita}
                                        {renderDiferenca(index, "coxaMedialDireita")}
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Coxa Distal Esquerda</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.coxaDistalEsquerda}
                                        {renderDiferenca(index, "coxaDistalEsquerda")}
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Coxa Distal Direita</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.coxaDistalDireita}
                                        {renderDiferenca(index, "coxaDistalDireita")}
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Panturrilha Esquerda</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.panturrilhaEsquerda}
                                        {renderDiferenca(index, "panturrilhaEsquerda")}
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Panturrilha Direita</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.panturrilhaDireita}
                                        {renderDiferenca(index, "panturrilhaDireita")}
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Braço Relaxado Esquerdo</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.bracoRelaxadoEsquerdo}
                                        {renderDiferenca(index, "bracoRelaxadoEsquerdo")}
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Braço Relaxado Direito</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.bracoRelaxadoDireito}
                                        {renderDiferenca(index, "bracoRelaxadoDireito")}
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Braço Contraído Esquerdo</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.bracoContraidoEsquerdo}
                                        {renderDiferenca(index, "bracoContraidoEsquerdo")}
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Braço Contraído Direito</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.bracoContraidoDireito}
                                        {renderDiferenca(index, "bracoContraidoDireito")}
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Antebraço Esquerdo</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.antebraçoEsquerdo}
                                        {renderDiferenca(index, "antebraçoEsquerdo")}
                                    </td>
                                ))}
                            </tr>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Antebraço Direito</td>
                                {circunferencias.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia.antebraçoDireito}
                                        {renderDiferenca(index, "antebraçoDireito")}
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}