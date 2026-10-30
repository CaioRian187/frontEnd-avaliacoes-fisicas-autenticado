import React, { useEffect, useState } from "react";
import { Input } from "./Input";
import type { DobraCutanea } from "../interfaces/DobraCutanea";
import type { DobrasRequest } from "../interfaces/DobrasRequest";
import { updateDobra } from "../services/DobraService";
import { useFeedbackModal } from "../hooks/useFeedback";

interface ModalEditarDobraProps {
    dobra: DobraCutanea;
    dobras: DobraCutanea[];
    setDobras: (dobras: DobraCutanea[]) => void;
    idAndNomeUsuarios: { id: string; nome: string }[];
    onClose: () => void;
}

interface CampoMedidaProps {
    label: string;
    value: number | string;
    onChange: (value: string) => void;
    type?: string;
    placeholder?: string;
}

// Campo reutilizavel que elimina a repeticao de <label> + <Input> em cada medida.
const CampoMedida = ({
    label,
    value,
    onChange,
    type = "number",
    placeholder = "0",
}: CampoMedidaProps) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-lg font-medium text-slate-700">{label}</label>
        <Input
            classname="w-full px-4 py-2.5 rounded-lg border-2 border-blue-200"
            placeholder={placeholder}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
);

export const ModalEditarDobra = ({ dobra, dobras, setDobras, idAndNomeUsuarios, onClose }: ModalEditarDobraProps) => {

    const { showSuccess, showWarning, showError } = useFeedbackModal();
    const [data, setData] = useState(dobra.data ?? "");
    const [biceps, setBiceps] = useState<number | string>(dobra.biceps ?? "");
    const [peitoral, setPeitoral] = useState<number | string>(dobra.peitoral ?? "");
    const [triceps, setTriceps] = useState<number | string>(dobra.triceps ?? "");
    const [subescapular, setSubescapular] = useState<number | string>(dobra.subescapular ?? "");
    const [panturrilhaMedial, setPanturrilhaMedial] = useState<number | string>(dobra.panturrilhaMedial ?? "");
    const [abdominal, setAbdominal] = useState<number | string>(dobra.abdominal ?? "");
    const [suprailiaca, setSuprailiaca] = useState<number | string>(dobra.suprailiaca ?? "");
    const [coxa, setCoxa] = useState<number | string>(dobra.coxa ?? "");
    const [aluno_id, setAluno_id] = useState<string>(dobra.aluno?.id ?? "");

    // Sincroniza os campos caso a dobra selecionada para edicao mude.
    useEffect(() => {
        setData(dobra.data ?? "");
        setBiceps(dobra.biceps ?? "");
        setPeitoral(dobra.peitoral ?? "");
        setTriceps(dobra.triceps ?? "");
        setSubescapular(dobra.subescapular ?? "");
        setPanturrilhaMedial(dobra.panturrilhaMedial ?? "");
        setAbdominal(dobra.abdominal ?? "");
        setSuprailiaca(dobra.suprailiaca ?? "");
        setCoxa(dobra.coxa ?? "");
        setAluno_id(dobra.aluno?.id ?? "");
    }, [dobra]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!data || !aluno_id) {
            showWarning("Por favor, preencha a data e selecione um aluno!");
            return;
        }

        const medidasObrigatorias = [
            biceps, peitoral, triceps, subescapular,
            panturrilhaMedial, abdominal, suprailiaca, coxa,
        ];

        if (medidasObrigatorias.some((medida) => medida === "" || medida === null)) {
            showWarning("Por favor, preencha todas as medidas!");
            return;
        }

        const request: DobrasRequest = {
            data: data,
            biceps: Number(biceps),
            peitoral: Number(peitoral),
            triceps: Number(triceps),
            subescapular: Number(subescapular),
            panturrilhaMedial: Number(panturrilhaMedial),
            abdominal: Number(abdominal),
            suprailiaca: Number(suprailiaca),
            coxa: Number(coxa),
            aluno_id: aluno_id,
        };

        try {
            const atualizada = await updateDobra(dobra.id, request);
            setDobras(dobras.map((item) => (item.id === atualizada.id ? atualizada : item)));
            onClose();
            showSuccess("Dobra cutânea atualizada com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar dobra cutânea: ", error);
            showError("Falha ao atualizar a dobra cutânea. Verifique os dados inseridos.");
        }
    }

    return (
        // Overlay no mesmo padrao visual do ModalDelete
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <form
                    onSubmit={handleSubmit}
                    className="w-full h-auto flex flex-col items-center justify-center gap-6 bg-white shadow-md rounded-2xl p-4 md:p-8"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Editar Dobras Cutâneas</h2>

                    <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">

                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-lg font-medium text-slate-700">Aluno</label>
                                <select
                                    className="w-full px-4 py-2.5 rounded-lg border-2 border-blue-200"
                                    value={aluno_id}
                                    onChange={(e) => setAluno_id(e.target.value)}
                                >
                                    <option value="">Selecione um aluno</option>
                                    {idAndNomeUsuarios.map((aluno) => (
                                        <option key={aluno.id} value={aluno.id}>
                                            {aluno.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <CampoMedida
                                label="Data"
                                value={data}
                                onChange={setData}
                                type="date"
                                placeholder=""
                            />

                            <CampoMedida label="Bíceps" value={biceps} onChange={setBiceps} />
                            <CampoMedida label="Peitoral" value={peitoral} onChange={setPeitoral} />
                            <CampoMedida label="Tríceps" value={triceps} onChange={setTriceps} />
                        </div>

                        <div className="flex flex-col gap-4">
                            <CampoMedida label="Subescapular" value={subescapular} onChange={setSubescapular} />
                            <CampoMedida label="Panturrilha Medial" value={panturrilhaMedial} onChange={setPanturrilhaMedial} />
                            <CampoMedida label="Abdominal" value={abdominal} onChange={setAbdominal} />
                            <CampoMedida label="Suprailíaca" value={suprailiaca} onChange={setSuprailiaca} />
                            <CampoMedida label="Coxa" value={coxa} onChange={setCoxa} />
                        </div>

                    </div>

                    {/* Responsividade: botoes empilham em mobile e voltam a row a partir de sm */}
                    <div className="w-full max-w-3xl flex flex-col sm:flex-row gap-4">
                        <button
                            type="submit"
                            className="w-full px-3 py-2 rounded-md bg-blue-700 text-white hover:bg-blue-600"
                        >
                            Salvar Alterações
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full px-3 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
