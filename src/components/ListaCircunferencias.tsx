import { useMemo, useState } from "react";
import { converterData } from "../utils/ConverterData";
import type { Circunferencia } from "../interfaces/Circunferencia";
import { ModalDelete } from "./ModalDelete";
import { deleteCircunferenciasById } from "../services/CircunferenciaService";

interface CircunferenciaProps {
    isAdmin: boolean;
    idAndNomeUsuarios: { id: string, nome: string }[];
    circunferencias: Circunferencia[];
    setCircunferencias: (circunferencias: Circunferencia[]) => void;
}

export const ListaCircunferencias = ({ isAdmin, idAndNomeUsuarios, circunferencias, setCircunferencias }: CircunferenciaProps) => {
    const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
    const [idParaDeletar, setIdParaDeletar] = useState<number | null>(null);
    const [aluno_id, setAluno_id] = useState<string>("");

    const circunferenciasOrdenadas = useMemo(() => {
        return [...circunferencias].sort((a, b) =>
            new Date(a.data || 0).getTime() - new Date(b.data || 0).getTime()
        );

    }, [circunferencias]);

    const renderDiferenca = (index: number, campo: keyof Circunferencia) => {
        if (index === 0) return null;

        const valorAtual = circunferenciasOrdenadas[index][campo] as number | undefined;
        const valorAnterior = circunferenciasOrdenadas[index - 1][campo] as number | undefined;

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

    const handleButtonDelete = (circunferenciaId: number) => {
        setIsOpenModalDelete(true);
        setIdParaDeletar(circunferenciaId);
    };

    const onClickSimModalDelete = async () => {
        if (idParaDeletar === null) return;

        try {
            await deleteCircunferenciasById(idParaDeletar);
            setCircunferencias(circunferencias.filter((item) => Number(item.id) !== idParaDeletar));
            setIsOpenModalDelete(false);
            setIdParaDeletar(null);
        } catch (error) {
            console.error("Erro ao deletar Circunferência: ", error);
        }
    }

    return (
        <div>
            {isOpenModalDelete && (
                <ModalDelete
                    setIsOpenModalDelete={setIsOpenModalDelete}
                    msg="Deseja realmente excluir esse registro de circunferências?"
                    onClickSim={onClickSimModalDelete}
                />
            )}

            {isAdmin ? (
                // Responsividade: min-w-6xl fixo removido; overflow-x-auto + min-w-max mantem o design da tabela com scroll horizontal em telas pequenas
                <div className="w-full max-w-6xl overflow-x-auto">
                    <table className="table-auto bg-white min-w-max w-full rounded-2xl shadow-md">
                        <thead>
                            {isAdmin && (
                                <tr className="text-center hover:bg-gray-50">
                                    <td className="p-4 text-center font-bold text-gray-800">Aluno</td>
                                    <td>
                                        <select
                                            value={aluno_id}
                                            onChange={(e) => setAluno_id(e.target.value)}
                                            className="w-full px-3 py-2 border rounded"
                                        >
                                            <option value="">Selecione um aluno</option>
                                            {idAndNomeUsuarios.map((aluno) => (
                                                <option key={aluno.id} value={aluno.id}>
                                                    {aluno.nome}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            )}
                            <tr className="border-b border-gray-200 text-gray-700 p-2">
                                <th className="p-4 text-center">Medidas</th>
                                {circunferenciasOrdenadas.map((circunferencia) => (
                                    <th
                                        className="p-4 text-center"
                                        key={circunferencia.id}>
                                        {converterData(circunferencia.data || "")}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {isAdmin && (
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
                                                onClick={() => handleButtonDelete(Number(circunferencia.id))}
                                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                                                Excluir
                                            </button>
                                        </td>
                                    ))}
                                </tr>
                            )}
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
                // Responsividade: container com overflow-x-auto preserva o design e permite scroll horizontal da tabela
                <div className="px-4 w-full max-w-7xl overflow-x-auto">
                    <table className="table-auto bg-white w-full rounded-2xl shadow-md">
                        <thead className="lex flex-col items-center justify-center">
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