import React, { useState } from "react";
import { Input } from "./Input";
import type { DobraCutanea } from "../interfaces/DobraCutanea";
import type { DobrasRequest } from "../interfaces/DobrasRequest";
import { createDobra } from "../services/DobraService";
import { useFeedbackModal } from "../hooks/useFeedbackModal";

interface FormDobrasProps {
    idAndNomeUsuarios: { id: string; nome: string }[];
    dobras: DobraCutanea[];
    setDobras: (dobras: DobraCutanea[]) => void;
}

interface CampoMedidaProps {
    label: string;
    value: number | string;
    onChange: (value: string) => void;
    type?: string;
    placeholder?: string;
    className?: string;
}

const CampoMedida = ({
    label,
    value,
    onChange,
    type = "number",
    placeholder = "0",
    className = "w-full flex flex-col gap-1 items-start",
}: CampoMedidaProps) => (
    <div className={className}>
        <label className="text-md font-medium text-gray-700">{label}</label>
        <Input
            classname="w-full border rounded-md px-3 py-2.5 text-base min-h-11"
            placeholder={placeholder}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
);

interface LinhaCamposProps {
    campos: [CampoMedidaProps, CampoMedidaProps];
    className?: string;
}

const LinhaCampos = ({ campos, className = "w-full flex flex-col sm:flex-row gap-4" }: LinhaCamposProps) => (
    <div className={className}>
        {campos.map((campo) => (
            <CampoMedida
                key={campo.label}
                {...campo}
                className="w-full sm:w-1/2 flex flex-col items-start gap-1 justify-center"
            />
        ))}
    </div>
);

export const FormDobras = ({ idAndNomeUsuarios, dobras, setDobras }: FormDobrasProps) => {

    const { showSuccess, showWarning, showError } = useFeedbackModal();
    const [data, setData] = useState<string>("");
    const [biceps, setBiceps] = useState<number | string>("");
    const [peitoral, setPeitoral] = useState<number | string>("");
    const [triceps, setTriceps] = useState<number | string>("");
    const [subescapular, setSubescapular] = useState<number | string>("");
    const [panturrilhaMedial, setPanturrilhaMedial] = useState<number | string>("");
    const [abdominal, setAbdominal] = useState<number | string>("");
    const [suprailiaca, setSuprailiaca] = useState<number | string>("");
    const [coxa, setCoxa] = useState<number | string>("");
    const [aluno_id, setAluno_id] = useState<string>("");

    const validarCampos = (): boolean => {
        if (!aluno_id) {
            showWarning("Por favor, selecione um aluno.");
            return false;
        }

        if (!data) {
            showWarning("Por favor, informe a data.");
            return false;
        }

        const medidasObrigatorias = [
            biceps, peitoral, triceps, subescapular,
            panturrilhaMedial, abdominal, suprailiaca, coxa,
        ];

        if (medidasObrigatorias.some((medida) => medida === "" || medida === null)) {
            showWarning("Por favor, preencha todas as medidas!");
            return false;
        }

        return true;
    }

    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validarCampos()) return;

        try {
            const dobrasRequest: DobrasRequest = {
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
            }

            const dobraResponse = await createDobra(dobrasRequest);
            setDobras([...dobras, dobraResponse]);
            resetarForm();
            showSuccess("Dobra cutânea cadastrada com sucesso!");

        } catch (error) {
            console.error("Erro ao cadastrar a dobra cutânea", error);
            showError("Falha ao cadastrar a dobra cutânea. Verifique os dados inseridos.");
        }
    }

    const resetarForm = () => {
        setData("");
        setBiceps("");
        setPeitoral("");
        setTriceps("");
        setSubescapular("");
        setPanturrilhaMedial("");
        setAbdominal("");
        setSuprailiaca("");
        setCoxa("");
        setAluno_id("");
    }

    const linhasMedidas: [CampoMedidaProps, CampoMedidaProps][] = [
        [
            { label: "Bíceps", value: biceps, onChange: setBiceps },
            { label: "Peitoral", value: peitoral, onChange: setPeitoral },
        ],
        [
            { label: "Tríceps", value: triceps, onChange: setTriceps },
            { label: "Subescapular", value: subescapular, onChange: setSubescapular },
        ],
        [
            { label: "Panturrilha Medial", value: panturrilhaMedial, onChange: setPanturrilhaMedial },
            { label: "Abdominal", value: abdominal, onChange: setAbdominal },
        ],
        [
            { label: "Suprailíaca", value: suprailiaca, onChange: setSuprailiaca },
            { label: "Coxa", value: coxa, onChange: setCoxa },
        ],
    ];

    return (
        /* 1. Container externo expansível, ocupando a largura total como na tela de circunferências */
        <div className="w-full">
            <form
                onSubmit={handleSubmitForm}
                className="w-full h-auto flex flex-col items-center justify-center gap-6 bg-white shadow-md rounded-2xl p-6 md:p-8 mb-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Cadastrar Dobras Cutâneas</h2>

                {/* 2. Bloco interno de Avaliação ocupando 85% do cartão branco */}
                <div className="w-full sm:w-11/12 border border-blue-700 rounded-2xl flex flex-col items-center justify-center py-6 px-4 md:px-8 shadow-sm gap-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Avaliação</h3>

                    <div className="w-full flex flex-col items-start gap-1">
                        <label className="text-md font-medium text-gray-700">Aluno</label>
                        <select
                            value={aluno_id}
                            onChange={(e) => setAluno_id(e.target.value)}
                            className="w-full px-4 py-2.5 border rounded-md text-base min-h-11"
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
                        className="w-full flex flex-col items-start gap-1"
                    />

                    {linhasMedidas.map((linha, index) => (
                        <LinhaCampos key={index} campos={linha} />
                    ))}
                </div>

                {/* 3. Botão Salvar perfeitamente alinhado com a caixa de Avaliação */}
                <button
                    type="submit"
                    className="w-full sm:w-11/12 px-3 py-2.5 rounded-md bg-blue-700 text-white font-medium hover:bg-blue-600 transition-colors">
                    Salvar
                </button>
            </form>
        </div>
    );
};