import { useMemo, useState } from "react";
import { converterData } from "../utils/ConverterData";
import type { DobraCutanea } from "../interfaces/DobraCutanea";
import { ModalDelete } from "./ModalDelete";
import { deleteDobraById } from "../services/DobraService";
import { useFeedbackModal } from "../hooks/useFeedbackModal";

type MedidaKey =
    | "biceps"
    | "peitoral"
    | "triceps"
    | "subescapular"
    | "panturrilhaMedial"
    | "abdominal"
    | "suprailiaca"
    | "coxa"
    | "relacaoCinturaQuadril"
    | "percentualGordura";

interface MedidaConfig {
    label: string;
    key: MedidaKey;
}

// Configuracao unica das medidas: evita repetir a mesma linha na tabela e nos cards.
const MEDIDAS: MedidaConfig[] = [
    { label: "Bíceps", key: "biceps" },
    { label: "Peitoral", key: "peitoral" },
    { label: "Tríceps", key: "triceps" },
    { label: "Subescapular", key: "subescapular" },
    { label: "Panturrilha Medial", key: "panturrilhaMedial" },
    { label: "Abdominal", key: "abdominal" },
    { label: "Suprailíaca", key: "suprailiaca" },
    { label: "Coxa", key: "coxa" },
    { label: "Relação Cintura/Quadril", key: "relacaoCinturaQuadril" },
    { label: "Percentual de Gordura", key: "percentualGordura" },
];

interface DobrasProps {
    isAdmin: boolean;
    idAndNomeUsuarios: { id: string, nome: string }[];
    dobras: DobraCutanea[];
    setDobras: (dobras: DobraCutanea[]) => void;
    onEdit: (dobra: DobraCutanea) => void;
    onSelecionarAluno?: (alunoId: string) => void;
}

export const ListaDobras = ({ isAdmin, idAndNomeUsuarios, dobras, setDobras, onEdit, onSelecionarAluno }: DobrasProps) => {
    const { showSuccess, showError } = useFeedbackModal();
    const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
    const [idParaDeletar, setIdParaDeletar] = useState<string | number | null>(null);
    const [aluno_id, setAluno_id] = useState<string>("");

    const dobrasOrdenadas = useMemo(() => {
        return [...dobras].sort((a, b) =>
            new Date(a.data || 0).getTime() - new Date(b.data || 0).getTime()
        );

    }, [dobras]);

    const renderDiferenca = (index: number, campo: MedidaKey) => {
        if (index === 0) return null;

        const valorAtual = dobrasOrdenadas[index][campo];
        const valorAnterior = dobrasOrdenadas[index - 1][campo];

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

    const handleButtonDelete = (dobraId: string | number) => {
        setIsOpenModalDelete(true);
        setIdParaDeletar(dobraId);
    };

    const onClickSimModalDelete = async () => {
        if (idParaDeletar === null) return;

        try {
            await deleteDobraById(idParaDeletar);
            setDobras(dobras.filter((item) => item.id !== idParaDeletar));
            setIsOpenModalDelete(false);
            setIdParaDeletar(null);
            showSuccess("Dobra cutânea excluída com sucesso!");
        } catch (error) {
            console.error("Erro ao deletar dobra cutânea: ", error);
            showError("Falha ao excluir a dobra cutânea.");
        }
    }

    const handleSelecionarAluno = (alunoId: string) => {
        setAluno_id(alunoId);
        onSelecionarAluno?.(alunoId);
    }

    const renderBotoesAcao = (dobra: DobraCutanea) => (
        <div className="flex flex-row gap-2 justify-center">
            <button
                onClick={() => onEdit(dobra)}
                className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600">
                Editar
            </button>
            <button
                onClick={() => handleButtonDelete(dobra.id)}
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
                    msg="Deseja realmente excluir esse registro de dobras cutâneas?"
                    onClickSim={onClickSimModalDelete}
                />
            )}

            {/* Mobile: um card por data/avaliacao, no mesmo padrao das demais telas (visivel apenas abaixo de md) */}
            <div className="w-full max-w-6xl flex flex-col gap-4 md:hidden">
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

                {dobrasOrdenadas.map((dobra, index) => (
                    <div
                        key={dobra.id}
                        className="bg-white rounded-2xl shadow-md p-4 flex flex-col gap-2"
                    >
                        <div className="flex justify-between items-center gap-2">
                            <h3 className="text-lg font-bold text-gray-800">
                                {converterData(dobra.data || "")}
                            </h3>
                        </div>

                        {MEDIDAS.map((medida) => (
                            <div key={medida.key} className="flex justify-between items-center gap-2 text-sm text-gray-600">
                                <span>{medida.label}</span>
                                <span className="text-gray-800 font-medium">
                                    {dobra[medida.key]}
                                    {renderDiferenca(index, medida.key)}
                                </span>
                            </div>
                        ))}

                        {isAdmin && (
                            <div className="mt-2">
                                {renderBotoesAcao(dobra)}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Desktop: tabela no mesmo padrao visual das demais telas (visivel a partir de md) */}
            <div className="hidden md:block w-full max-w-6xl overflow-x-auto">
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
                            {dobrasOrdenadas.map((dobra) => (
                                <th
                                    className="p-4 text-center"
                                    key={dobra.id}>
                                    {converterData(dobra.data || "")}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isAdmin && (
                            <tr className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">Ações</td>
                                {dobrasOrdenadas.map((dobra) => (
                                    <td
                                        className="p-2"
                                        key={dobra.id}
                                    >
                                        {renderBotoesAcao(dobra)}
                                    </td>
                                ))}
                            </tr>
                        )}
                        {MEDIDAS.map((medida) => (
                            <tr key={medida.key} className="text-center hover:bg-gray-50">
                                <td className="p-2 text-gray-800">{medida.label}</td>
                                {dobrasOrdenadas.map((dobra, index) => (
                                    <td key={dobra.id}>
                                        {dobra[medida.key]}
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
