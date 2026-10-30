import React, { useEffect, useState } from "react";
import { Input } from "./Input";
import type { Circunferencia } from "../interfaces/Circunferencia";
import type { CircunferenciasRequest } from "../interfaces/CircunferenciasRequest";
import { updateCircunferencia } from "../services/CircunferenciaService";
import { useFeedbackModal } from "../hooks/useFeedback";

interface ModalEditarCircunferenciaProps {
    circunferencia: Circunferencia;
    circunferencias: Circunferencia[];
    setCircunferencias: (circunferencias: Circunferencia[]) => void;
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

export const ModalEditarCircunferencia = ({
    circunferencia,
    circunferencias,
    setCircunferencias,
    idAndNomeUsuarios,
    onClose,
}: ModalEditarCircunferenciaProps) => {

    const { showSuccess, showWarning, showError } = useFeedbackModal();
    const [data, setData] = useState<string>(circunferencia.data ?? "");
    const [altura, setAltura] = useState<number | string>(circunferencia.altura ?? "");
    const [peso, setPeso] = useState<number | string>(circunferencia.peso ?? "");
    const [ombro, setOmbro] = useState<number | string>(circunferencia.ombro ?? "");
    const [cintura, setCintura] = useState<number | string>(circunferencia.cintura ?? "");
    const [quadril, setQuadril] = useState<number | string>(circunferencia.quadril ?? "");
    const [peitoral, setPeitoral] = useState<number | string>(circunferencia.peitoral ?? "");
    const [abdomen, setAbdomen] = useState<number | string>(circunferencia.abdomen ?? "");
    const [coxaProximalEsquerda, setCoxaProximalEsquerda] = useState<number | string>(circunferencia.coxaProximalEsquerda ?? "");
    const [coxaProximalDireita, setCoxaProximalDireita] = useState<number | string>(circunferencia.coxaProximalDireita ?? "");
    const [coxaMedialEsquerda, setCoxaMedialEsquerda] = useState<number | string>(circunferencia.coxaMedialEsquerda ?? "");
    const [coxaMedialDireita, setCoxaMedialDireita] = useState<number | string>(circunferencia.coxaMedialDireita ?? "");
    const [coxaDistalEsquerda, setCoxaDistalEsquerda] = useState<number | string>(circunferencia.coxaDistalEsquerda ?? "");
    const [coxaDistalDireita, setCoxaDistalDireita] = useState<number | string>(circunferencia.coxaDistalDireita ?? "");
    const [panturrilhaEsquerda, setPanturrilhaEsquerda] = useState<number | string>(circunferencia.panturrilhaEsquerda ?? "");
    const [panturrilhaDireita, setPanturrilhaDireita] = useState<number | string>(circunferencia.panturrilhaDireita ?? "");
    const [bracoRelaxadoEsquerdo, setBracoRelaxadoEsquerdo] = useState<number | string>(circunferencia.bracoRelaxadoEsquerdo ?? "");
    const [bracoRelaxadoDireito, setBracoRelaxadoDireito] = useState<number | string>(circunferencia.bracoRelaxadoDireito ?? "");
    const [bracoContraidoEsquerdo, setBracoContraidoEsquerdo] = useState<number | string>(circunferencia.bracoContraidoEsquerdo ?? "");
    const [bracoContraidoDireito, setBracoContraidoDireito] = useState<number | string>(circunferencia.bracoContraidoDireito ?? "");
    const [antebraçoEsquerdo, setAntebraçoEsquerdo] = useState<number | string>(circunferencia.antebraçoEsquerdo ?? "");
    const [antebraçoDireito, setAntebraçoDireito] = useState<number | string>(circunferencia.antebraçoDireito ?? "");
    const [aluno_id, setAluno_id] = useState<string>(circunferencia.aluno?.id ?? "");

    // Sincroniza os campos caso a circunferencia selecionada para edicao mude.
    useEffect(() => {
        setData(circunferencia.data ?? "");
        setAltura(circunferencia.altura ?? "");
        setPeso(circunferencia.peso ?? "");
        setOmbro(circunferencia.ombro ?? "");
        setCintura(circunferencia.cintura ?? "");
        setQuadril(circunferencia.quadril ?? "");
        setPeitoral(circunferencia.peitoral ?? "");
        setAbdomen(circunferencia.abdomen ?? "");
        setCoxaProximalEsquerda(circunferencia.coxaProximalEsquerda ?? "");
        setCoxaProximalDireita(circunferencia.coxaProximalDireita ?? "");
        setCoxaMedialEsquerda(circunferencia.coxaMedialEsquerda ?? "");
        setCoxaMedialDireita(circunferencia.coxaMedialDireita ?? "");
        setCoxaDistalEsquerda(circunferencia.coxaDistalEsquerda ?? "");
        setCoxaDistalDireita(circunferencia.coxaDistalDireita ?? "");
        setPanturrilhaEsquerda(circunferencia.panturrilhaEsquerda ?? "");
        setPanturrilhaDireita(circunferencia.panturrilhaDireita ?? "");
        setBracoRelaxadoEsquerdo(circunferencia.bracoRelaxadoEsquerdo ?? "");
        setBracoRelaxadoDireito(circunferencia.bracoRelaxadoDireito ?? "");
        setBracoContraidoEsquerdo(circunferencia.bracoContraidoEsquerdo ?? "");
        setBracoContraidoDireito(circunferencia.bracoContraidoDireito ?? "");
        setAntebraçoEsquerdo(circunferencia.antebraçoEsquerdo ?? "");
        setAntebraçoDireito(circunferencia.antebraçoDireito ?? "");
        setAluno_id(circunferencia.aluno?.id ?? "");
    }, [circunferencia]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!data || !aluno_id) {
            showWarning("Por favor, preencha a data e selecione um aluno!");
            return;
        }

        const request: CircunferenciasRequest = {
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
            aluno_id: aluno_id,
        };

        try {
            const atualizada = await updateCircunferencia(circunferencia.id, request);
            setCircunferencias(
                circunferencias.map((item) => (item.id === atualizada.id ? atualizada : item))
            );
            onClose();
            showSuccess("Circunferência atualizada com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar circunferência: ", error);
            showError("Falha ao atualizar a circunferência. Verifique os dados inseridos.");
        }
    }

    const camposGerais: CampoMedidaProps[] = [
        { label: "Peso (kg)", value: peso, onChange: setPeso },
        { label: "Altura (cm)", value: altura, onChange: setAltura },
        { label: "Ombro", value: ombro, onChange: setOmbro },
        { label: "Cintura", value: cintura, onChange: setCintura },
        { label: "Quadril", value: quadril, onChange: setQuadril },
        { label: "Peitoral", value: peitoral, onChange: setPeitoral },
        { label: "Abdômen", value: abdomen, onChange: setAbdomen },
    ];

    const camposMembrosInferiores: CampoMedidaProps[] = [
        { label: "Coxa Proximal Direita", value: coxaProximalDireita, onChange: setCoxaProximalDireita },
        { label: "Coxa Proximal Esquerda", value: coxaProximalEsquerda, onChange: setCoxaProximalEsquerda },
        { label: "Coxa Medial Direita", value: coxaMedialDireita, onChange: setCoxaMedialDireita },
        { label: "Coxa Medial Esquerda", value: coxaMedialEsquerda, onChange: setCoxaMedialEsquerda },
        { label: "Coxa Distal Direita", value: coxaDistalDireita, onChange: setCoxaDistalDireita },
        { label: "Coxa Distal Esquerda", value: coxaDistalEsquerda, onChange: setCoxaDistalEsquerda },
        { label: "Panturrilha Direita", value: panturrilhaDireita, onChange: setPanturrilhaDireita },
        { label: "Panturrilha Esquerda", value: panturrilhaEsquerda, onChange: setPanturrilhaEsquerda },
    ];

    const camposMembrosSuperiores: CampoMedidaProps[] = [
        { label: "Braço Relaxado Esquerdo", value: bracoRelaxadoEsquerdo, onChange: setBracoRelaxadoEsquerdo },
        { label: "Braço Relaxado Direito", value: bracoRelaxadoDireito, onChange: setBracoRelaxadoDireito },
        { label: "Braço Contraído Esquerdo", value: bracoContraidoEsquerdo, onChange: setBracoContraidoEsquerdo },
        { label: "Braço Contraído Direito", value: bracoContraidoDireito, onChange: setBracoContraidoDireito },
        { label: "Antebraço Esquerdo", value: antebraçoEsquerdo, onChange: setAntebraçoEsquerdo },
        { label: "Antebraço Direito", value: antebraçoDireito, onChange: setAntebraçoDireito },
    ];

    return (
        // Overlay no mesmo padrao visual do ModalDelete
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <form
                    onSubmit={handleSubmit}
                    className="w-full h-auto flex flex-col items-center justify-center gap-6 bg-white shadow-md rounded-2xl p-4 md:p-8"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Editar Circunferência</h2>

                    {/* Colunas empilham no mobile e viram duas colunas a partir de md */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

                        <div className="w-full flex flex-col gap-1.5">
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

                        {camposGerais.map((campo) => (
                            <CampoMedida key={campo.label} {...campo} />
                        ))}

                        {camposMembrosInferiores.map((campo) => (
                            <CampoMedida key={campo.label} {...campo} />
                        ))}

                        {camposMembrosSuperiores.map((campo) => (
                            <CampoMedida key={campo.label} {...campo} />
                        ))}

                    </div>

                    {/* Responsividade: botoes empilham em mobile e voltam a row a partir de sm */}
                    <div className="w-full flex flex-col sm:flex-row gap-4">
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
