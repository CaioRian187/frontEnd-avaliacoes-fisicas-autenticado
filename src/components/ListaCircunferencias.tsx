import { useMemo, useState } from "react";
import { converterData } from "../utils/ConverterData";
import type { Circunferencia } from "../interfaces/Circunferencia";
import { ModalDelete } from "./ModalDelete";
import { deleteCircunferenciasById } from "../services/CircunferenciaService";

type MedidaKey =
    | "altura"
    | "peso"
    | "imc"
    | "ombro"
    | "cintura"
    | "quadril"
    | "peitoral"
    | "abdomen"
    | "coxaProximalEsquerda"
    | "coxaProximalDireita"
    | "coxaMedialEsquerda"
    | "coxaMedialDireita"
    | "coxaDistalEsquerda"
    | "coxaDistalDireita"
    | "panturrilhaEsquerda"
    | "panturrilhaDireita"
    | "bracoRelaxadoEsquerdo"
    | "bracoRelaxadoDireito"
    | "bracoContraidoEsquerdo"
    | "bracoContraidoDireito"
    | "antebraçoEsquerdo"
    | "antebraçoDireito";

interface MedidaConfig {
    label: string;
    key: MedidaKey;
}

// Configuracao unica das medidas: evita repetir a mesma linha 22x na tabela e nos cards.
const MEDIDAS: MedidaConfig[] = [
    { label: "Altura", key: "altura" },
    { label: "Peso", key: "peso" },
    { label: "IMC", key: "imc" },
    { label: "Ombro", key: "ombro" },
    { label: "Cintura", key: "cintura" },
    { label: "Quadril", key: "quadril" },
    { label: "Peitoral", key: "peitoral" },
    { label: "Abdomen", key: "abdomen" },
    { label: "Coxa Proximal Esquerda", key: "coxaProximalEsquerda" },
    { label: "Coxa Proximal Direita", key: "coxaProximalDireita" },
    { label: "Coxa Medial Esquerda", key: "coxaMedialEsquerda" },
    { label: "Coxa Medial Direita", key: "coxaMedialDireita" },
    { label: "Coxa Distal Esquerda", key: "coxaDistalEsquerda" },
    { label: "Coxa Distal Direita", key: "coxaDistalDireita" },
    { label: "Panturrilha Esquerda", key: "panturrilhaEsquerda" },
    { label: "Panturrilha Direita", key: "panturrilhaDireita" },
    { label: "Braço Relaxado Esquerdo", key: "bracoRelaxadoEsquerdo" },
    { label: "Braço Relaxado Direito", key: "bracoRelaxadoDireito" },
    { label: "Braço Contraído Esquerdo", key: "bracoContraidoEsquerdo" },
    { label: "Braço Contraído Direito", key: "bracoContraidoDireito" },
    { label: "Antebraço Esquerdo", key: "antebraçoEsquerdo" },
    { label: "Antebraço Direito", key: "antebraçoDireito" },
];

interface CircunferenciaProps {
    isAdmin: boolean;
    idAndNomeUsuarios: { id: string, nome: string }[];
    circunferencias: Circunferencia[];
    setCircunferencias: (circunferencias: Circunferencia[]) => void;
    onSelecionarAluno?: (alunoId: string) => void;
    onEdit: (circunferencia: Circunferencia) => void;
}

export const ListaCircunferencias = ({ isAdmin, idAndNomeUsuarios, circunferencias, setCircunferencias, onSelecionarAluno, onEdit }: CircunferenciaProps) => {
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

    // Atualiza o aluno selecionado e dispara a busca das circunferências.
    const handleSelecionarAluno = (alunoId: string) => {
        setAluno_id(alunoId);
        onSelecionarAluno?.(alunoId);
    }

    const renderBotoesAcao = (circunferencia: Circunferencia) => (
        <div className="flex flex-row justify-center gap-2">
            <button
                onClick={() => onEdit(circunferencia)}
                className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600">
                Editar
            </button>
            <button
                onClick={() => handleButtonDelete(Number(circunferencia.id))}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                Excluir
            </button>
        </div>
    );

    return (
        <div className="w-full flex flex-col items-center">
            {isOpenModalDelete && (
                <ModalDelete
                    setIsOpenModalDelete={setIsOpenModalDelete}
                    msg="Deseja realmente excluir esse registro de circunferências?"
                    onClickSim={onClickSimModalDelete}
                />
            )}

            {/* Mobile: um card por data/avaliacao, no mesmo padrao da tela de alunos (visivel apenas abaixo de md) */}
            <div className="w-full flex flex-col gap-4 md:hidden">
                {/* Seletor unico do ADMIN no mobile: logo abaixo do formulario e acima dos cards */}
                {isAdmin && (
                    <div className="w-full flex flex-col gap-1 bg-white rounded-2xl shadow-md p-4">
                        <label className="text-md font-medium text-gray-700">Selecionar aluno</label>
                        <select
                            value={aluno_id}
                            onChange={(e) => handleSelecionarAluno(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                        >
                            <option value="">Selecione um aluno</option>
                            {idAndNomeUsuarios.map((aluno) => (
                                <option key={aluno.id} value={aluno.id}>
                                    {aluno.nome}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {circunferenciasOrdenadas.map((circunferencia, index) => (
                    <div
                        key={circunferencia.id}
                        className="bg-white rounded-2xl shadow-md p-4 flex flex-col gap-2"
                    >
                        <div className="flex justify-between items-center gap-2">
                            <h3 className="text-lg font-bold text-gray-800">
                                {converterData(circunferencia.data || "")}
                            </h3>
                        </div>

                        {MEDIDAS.map((medida) => (
                            <div key={medida.key} className="flex justify-between items-center gap-2 text-sm text-gray-600">
                                <span>{medida.label}</span>
                                <span className="text-gray-800 font-medium">
                                    {circunferencia[medida.key]}
                                    {renderDiferenca(index, medida.key)}
                                </span>
                            </div>
                        ))}

                        {isAdmin && (
                            <div className="mt-2">
                                        {renderBotoesAcao(circunferencia)}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Desktop: tabela no mesmo padrao visual das demais telas (visivel a partir de md) */}
            <div className="hidden md:block w-full overflow-x-auto">
                <table className="table-auto bg-white min-w-max w-full rounded-2xl shadow-md">
                    <thead>
                        {isAdmin && (
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-4 text-center font-bold text-gray-800">Aluno</td>
                                <td>
                                    <select
                                        value={aluno_id}
                                        onChange={(e) => handleSelecionarAluno(e.target.value)}
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
                                {circunferenciasOrdenadas.map((circunferencia) => (
                                    <td
                                        className="p-2"
                                        key={circunferencia.id}
                                    >
                                {renderBotoesAcao(circunferencia)}
                                    </td>
                                ))}
                            </tr>
                        )}
                        {MEDIDAS.map((medida) => (
                            <tr key={medida.key} className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">{medida.label}</td>
                                {circunferenciasOrdenadas.map((circunferencia, index) => (
                                    <td key={circunferencia.id}>
                                        {circunferencia[medida.key]}
                                        {renderDiferenca(index, medida.key)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
