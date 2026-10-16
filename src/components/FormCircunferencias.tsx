import React, { useState } from "react";
import { Input } from "./Input";
import type { CircunferenciasRequest } from "../interfaces/CircunferenciasRequest";
import { createCircunferencia } from "../services/CircunferenciaService";
import type { Circunferencia } from "../interfaces/Circunferencia";

interface FormCircunferenciasProps {
    idAndNomeUsuarios: { id: string; nome: string }[];
    circunferencias: Circunferencia[];
    setCircunferencias: (circunferencias: Circunferencia[]) => void;
}

interface CampoMedidaProps {
    label: string;
    value: number | string;
    onChange: (value: string) => void;
    type?: string;
    placeholder?: string;
    className?: string;
}

// Campo reutilizavel que elimina a repeticao de <label> + <Input> em cada medida.
const CampoMedida = ({
    label,
    value,
    onChange,
    type = "number",
    placeholder = "0",
    className = "w-3/4 flex flex-col gap-1 items-start",
}: CampoMedidaProps) => (
    <div className={className}>
        <label className="text-md font-medium text-gray-700">{label}</label>
        <Input
            classname="w-full border rounded-md px-3 py-2"
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

// Par de campos lado a lado no desktop e empilhados no mobile (mesmo padrao do formulario original).
const LinhaCampos = ({ campos, className = "w-3/4 flex flex-col sm:flex-row gap-4" }: LinhaCamposProps) => (
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

export const FormCircunferencias = ({ idAndNomeUsuarios, circunferencias, setCircunferencias }: FormCircunferenciasProps) => {

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
    const [antebraçoEsquerdo, setAntebraçoEsquerdo] = useState<number | string>("");
    const [antebraçoDireito, setAntebraçoDireito] = useState<number | string>("");
    const [aluno_id, setAluno_id] = useState<string>("");

    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const circunferenciaRequest: CircunferenciasRequest = {
                data: data,
                altura: Number(altura),
                peso: Number(peso),
                ombro: Number(ombro),
                cintura: Number(cintura),
                quadril: Number(quadril),
                peitoral: Number(peitoral),
                abdomen: Number(abdomen),
                coxaProximalEsquerda: Number(coxaProximalEsquerda),
                coxaProximalDireita: Number(coxaProximalDireita),
                coxaMedialEsquerda: Number(coxaMedialEsquerda),
                coxaMedialDireita: Number(coxaMedialDireita),
                coxaDistalEsquerda: Number(coxaDistalEsquerda),
                coxaDistalDireita: Number(coxaDistalDireita),
                panturrilhaEsquerda: Number(panturrilhaEsquerda),
                panturrilhaDireita: Number(panturrilhaDireita),
                bracoRelaxadoEsquerdo: Number(bracoRelaxadoEsquerdo),
                bracoRelaxadoDireito: Number(bracoRelaxadoDireito),
                bracoContraidoEsquerdo: Number(bracoContraidoEsquerdo),
                bracoContraidoDireito: Number(bracoContraidoDireito),
                antebraçoEsquerdo: Number(antebraçoEsquerdo),
                antebraçoDireito: Number(antebraçoDireito),
                aluno_id: aluno_id
            }

            const circunferenciaResponse = await createCircunferencia(circunferenciaRequest);
            setCircunferencias([...circunferencias, circunferenciaResponse]);
            alert("Circunfência cadastrada com sucesso!!!");
            resetarForm();

        } catch (error) {
            console.error("Erro ao cadastrar a circunferência", error);
            throw error;
        }

    }

    const resetarForm = () => {
        setData("")
        setAltura("");
        setPeso("");
        setOmbro("");
        setCintura("");
        setQuadril("");
        setPeitoral("");
        setAbdomen("");
        setCoxaProximalEsquerda("");
        setCoxaProximalDireita("");
        setCoxaMedialEsquerda("");
        setCoxaMedialDireita("");
        setCoxaDistalEsquerda("");
        setCoxaDistalDireita("");
        setPanturrilhaEsquerda("");
        setPanturrilhaDireita("");
        setBracoRelaxadoEsquerdo("");
        setBracoRelaxadoDireito("");
        setBracoContraidoEsquerdo("");
        setBracoContraidoDireito("");
        setAntebraçoEsquerdo("");
        setAntebraçoDireito("");
        setAluno_id("");
    }

    const camposGerais: CampoMedidaProps[] = [
        { label: "Ombro", value: ombro, onChange: setOmbro },
        { label: "Cintura", value: cintura, onChange: setCintura },
        { label: "Quadril", value: quadril, onChange: setQuadril },
        { label: "Peitoral", value: peitoral, onChange: setPeitoral },
        { label: "Abdômen", value: abdomen, onChange: setAbdomen, className: "w-3/4 flex flex-col gap-1 items-start mb-4" },
    ];

    const linhasMembrosInferiores: [CampoMedidaProps, CampoMedidaProps][] = [
        [
            { label: "Coxa Proximal Direita", value: coxaProximalDireita, onChange: setCoxaProximalDireita },
            { label: "Coxa Proximal Esquerda", value: coxaProximalEsquerda, onChange: setCoxaProximalEsquerda },
        ],
        [
            { label: "Coxa Medial Direita", value: coxaMedialDireita, onChange: setCoxaMedialDireita },
            { label: "Coxa Medial Esquerda", value: coxaMedialEsquerda, onChange: setCoxaMedialEsquerda },
        ],
        [
            { label: "Coxa Distal Direita", value: coxaDistalDireita, onChange: setCoxaDistalDireita },
            { label: "Coxa Distal Esquerda", value: coxaDistalEsquerda, onChange: setCoxaDistalEsquerda },
        ],
        [
            { label: "Panturrilha Direita", value: panturrilhaDireita, onChange: setPanturrilhaDireita },
            { label: "Panturrilha Esquerda", value: panturrilhaEsquerda, onChange: setPanturrilhaEsquerda },
        ],
    ];

    const linhasMembrosSuperiores: [CampoMedidaProps, CampoMedidaProps][] = [
        [
            { label: "Braço Relaxado Esquerdo", value: bracoRelaxadoEsquerdo, onChange: setBracoRelaxadoEsquerdo },
            { label: "Braço Relaxado Direito", value: bracoRelaxadoDireito, onChange: setBracoRelaxadoDireito },
        ],
        [
            { label: "Braço Contraido Esquerdo", value: bracoContraidoEsquerdo, onChange: setBracoContraidoEsquerdo },
            { label: "Braço Contraido Direito", value: bracoContraidoDireito, onChange: setBracoContraidoDireito },
        ],
        [
            { label: "Antebraço Esquerdo", value: antebraçoEsquerdo, onChange: setAntebraçoEsquerdo },
            { label: "Antebraço Direito", value: antebraçoDireito, onChange: setAntebraçoDireito },
        ],
    ];

    return (
        <div className="w-full">
            {/* Colunas empilham (flex-col) no mobile e voltam a row a partir de md, como na tela de alunos */}
            <form
                onSubmit={handleSubmitForm}
                className="w-full h-auto flex flex-col items-center justify-center gap-6 bg-white shadow-md rounded-2xl p-4 md:p-8 mb-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Cadastrar Circunferência</h2>

                <div className="w-full flex flex-col md:flex-row gap-4">

                    <div className="w-full md:w-1/2 border-l border-r shadow-lg border-blue-700 rounded-2xl flex flex-col items-center justify-center">
                        <h3 className="text-lg font-semibold text-gray-800">Geral e tronco</h3>

                        <div className="w-3/4 flex flex-col items-start gap-1">
                            <h3 className="text-md font-medium text-gray-700 text-start">Aluno</h3>
                            <select
                                value={aluno_id}
                                onChange={(e) => setAluno_id(e.target.value)}
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

                        <CampoMedida
                            label="Data"
                            value={data}
                            onChange={setData}
                            type="date"
                            placeholder=""
                            className="w-3/4 flex flex-col items-start gap-1"
                        />

                        <LinhaCampos
                            campos={[
                                { label: "Peso (kg)", value: peso, onChange: setPeso },
                                { label: "Altura (Cm)", value: altura, onChange: setAltura },
                            ]}
                        />

                        {camposGerais.map((campo) => (
                            <CampoMedida key={campo.label} {...campo} />
                        ))}
                    </div>

                    <div className="w-full md:w-1/2 rounded-2xl border-l border-r border-blue-500 shadow-lg flex flex-col items-center justify-center">
                        <h3 className="text-lg font-semibold text-gray-800">Membros Inferiores</h3>

                        {linhasMembrosInferiores.map((linha, index) => (
                            <LinhaCampos key={index} campos={linha} />
                        ))}

                        <div className="w-full mt-11 flex flex-col items-center justify-center">
                            <h3 className="text-lg font-semibold text-gray-800">Membros Superiores</h3>

                            {linhasMembrosSuperiores.map((linha, index) => (
                                <LinhaCampos
                                    key={index}
                                    campos={linha}
                                    className={
                                        index === linhasMembrosSuperiores.length - 1
                                            ? "w-3/4 flex flex-col sm:flex-row gap-4 mb-4"
                                            : "w-3/4 flex flex-col sm:flex-row gap-4"
                                    }
                                />
                            ))}
                        </div>
                    </div>

                </div>

                <button
                    type="submit"
                    className="w-full px-3 py-2 rounded-md bg-blue-700 text-white hover:bg-blue-600">
                    Salvar
                </button>
            </form>
        </div>
    );
}
