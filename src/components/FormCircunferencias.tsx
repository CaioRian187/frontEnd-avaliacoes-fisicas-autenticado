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

    return (
        <div>
            <form
                onSubmit={handleSubmitForm}
                className="w-full min-w-6xl h-auto flex flex-col items-center justify-center gap-6 bg-white shadow-md rounded-2xl p-8 mb-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Cadastrar Circunferência</h2>

                <div className="w-full flex flex-row gap-4">

                    <div className="w-1/2 border-l border-r shadow-lg border-blue-700 rounded-2xl flex flex-col items-center justify-center">
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


                        <div className="w-3/4 flex flex-col items-start gap-1">
                            <h3 className="text-md font-medium text-gray-700">Data</h3>
                            <Input
                                classname="w-full border rounded-md px-3 py-2"
                                placeholder=""
                                type="date"
                                value={data}
                                onChange={(e) => setData(e.target.value)}
                            />
                        </div>


                        <div className="w-3/4 flex flex-row gap-4">
                            <div className="w-1/2 flex flex-col gap-1 justify-center items-start">
                                <h3 className="text-md font-medium text-gray-700">Peso (kg)</h3>
                                <Input
                                    classname="w-full border rounded-md px-3 py-2"
                                    placeholder="0"
                                    type="number"
                                    value={peso}
                                    onChange={(e) => setPeso(e.target.value)}
                                />
                            </div>

                            <div className="w-1/2 flex flex-col gap-1 justify-center items-start">
                                <h3 className="text-md font-medium text-gray-700">Altura (Cm)</h3>
                                <Input
                                    classname="w-full border rounded-md px-3 py-2"
                                    placeholder="0"
                                    type="number"
                                    value={altura}
                                    onChange={(e) => setAltura(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="w-3/4 flex flex-col gap-1 items-start">
                            <h3 className="text-md font-medium text-gray-700">Ombro</h3>
                            <Input
                                classname="w-full border rounded-md px-3 py-2"
                                placeholder="0"
                                type="number"
                                value={ombro}
                                onChange={(e) => setOmbro(e.target.value)}
                            />
                        </div>

                        <div className="w-3/4 flex flex-col gap-1 items-start">
                            <h3 className="text-md font-medium text-gray-700">Cintura</h3>
                            <Input
                                classname="w-full border rounded-md px-3 py-2"
                                placeholder="0"
                                type="number"
                                value={cintura}
                                onChange={(e) => setCintura(e.target.value)}
                            />
                        </div>
                        <div className="w-3/4 flex flex-col gap-1 items-start">
                            <h3 className="text-md font-medium text-gray-700">Quadril</h3>
                            <Input
                                classname="w-full border rounded-md px-3 py-2"
                                placeholder="0"
                                type="number"
                                value={quadril}
                                onChange={(e) => setQuadril(e.target.value)}
                            />
                        </div>
                        <div className="w-3/4 flex flex-col gap-1 items-start">
                            <h3 className="text-md font-medium text-gray-700">Peitoral</h3>
                            <Input
                                classname="w-full border rounded-md px-3 py-2"
                                placeholder="0"
                                type="number"
                                value={peitoral}
                                onChange={(e) => setPeitoral(e.target.value)}
                            />
                        </div>
                        <div className="w-3/4 flex flex-col gap-1 items-start mb-4">
                            <h3 className="text-md font-medium text-gray-700">Abdômen</h3>
                            <Input
                                classname="w-full border rounded-md px-3 py-2"
                                placeholder="0"
                                type="number"
                                value={abdomen}
                                onChange={(e) => setAbdomen(e.target.value)}
                            />
                        </div>

                    </div>

                    <div className="w-1/2 rounded-2xl border-l border-r border-blue-500 shadow-lg flex flex-col items-center justify-center">
                        <h3 className="text-lg font-semibold text-gray-800">Membros Inferiores</h3>

                        <div className="w-3/4 flex flex-row gap-4">
                            <div className="w-1/2 flex flex-col items-start gap-1 justify-center">
                                <label className="text-md font-medium text-gray-700">Coxa Proximal Direita</label>
                                <Input
                                    classname="w-full border rounded-md px-3 py-2"
                                    placeholder="0"
                                    type="number"
                                    value={coxaProximalDireita}
                                    onChange={(e) => setCoxaProximalDireita(e.target.value)}
                                />
                            </div>
                            <div className="w-1/2 flex flex-col items-start gap-1 justify-center">
                                <label className="text-md font-medium text-gray-700">Coxa Proximal Esquerda</label>
                                <Input
                                    classname="w-full border rounded-md px-3 py-2"
                                    placeholder="0"
                                    type="number"
                                    value={coxaProximalEsquerda}
                                    onChange={(e) => setCoxaProximalEsquerda(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="w-3/4 flex flex-row gap-4">
                            <div className="w-1/2 flex flex-col items-start gap-1 justify-center">
                                <label className="text-md font-medium text-gray-700">Coxa Medial Direita</label>
                                <Input
                                    classname="w-full border rounded-md px-3 py-2"
                                    placeholder="0"
                                    type="number"
                                    value={coxaMedialDireita}
                                    onChange={(e) => setCoxaMedialDireita(e.target.value)}
                                />
                            </div>
                            <div className="w-1/2 flex flex-col items-start gap-1 justify-center">
                                <label className="text-md font-medium text-gray-700">Coxa Medial Esquerda</label>
                                <Input
                                    classname="w-full border rounded-md px-3 py-2"
                                    placeholder="0"
                                    type="number"
                                    value={coxaMedialEsquerda}
                                    onChange={(e) => setCoxaMedialEsquerda(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="w-3/4 flex flex-row gap-4">
                            <div className="w-1/2 flex flex-col items-start gap-1 justify-center">
                                <label className="text-md font-medium text-gray-700">Coxa Distal Direita</label>
                                <Input
                                    classname="w-full border rounded-md px-3 py-2"
                                    placeholder="0"
                                    type="number"
                                    value={coxaDistalDireita}
                                    onChange={(e) => setCoxaDistalDireita(e.target.value)}
                                />
                            </div>
                            <div className="w-1/2 flex flex-col items-start gap-1 justify-center">
                                <label className="text-md font-medium text-gray-700">Coxa Distal Esquerda</label>
                                <Input
                                    classname="w-full border rounded-md px-3 py-2"
                                    placeholder="0"
                                    type="number"
                                    value={coxaDistalEsquerda}
                                    onChange={(e) => setCoxaDistalEsquerda(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="w-3/4 flex flex-row gap-4">
                            <div className="w-1/2 flex flex-col items-start gap-1 justify-center">
                                <label className="text-md font-medium text-gray-700">Panturrilha Direita</label>
                                <Input
                                    classname="w-full border rounded-md px-3 py-2"
                                    placeholder="0"
                                    type="number"
                                    value={panturrilhaDireita}
                                    onChange={(e) => setPanturrilhaDireita(e.target.value)}
                                />
                            </div>
                            <div className="w-1/2 flex flex-col items-start gap-1 justify-center">
                                <label className="text-md font-medium text-gray-700">Panturrilha Esquerda</label>
                                <Input
                                    classname="w-full border rounded-md px-3 py-2"
                                    placeholder="0"
                                    type="number"
                                    value={panturrilhaEsquerda}
                                    onChange={(e) => setPanturrilhaEsquerda(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="w-full mt-11 flex flex-col items-center justify-center">
                            <h3 className="text-lg font-semibold text-gray-800">Membros Superiores</h3>

                            <div className="w-3/4 flex flex-row gap-4">
                                <div className="w-1/2 flex flex-col items-start gap-1 justify-center">
                                    <label className="text-md font-medium text-gray-700">Braço Relaxado Esquerdo</label>
                                    <Input
                                        classname="w-full border rounded-md px-3 py-2"
                                        placeholder="0"
                                        type="number"
                                        value={bracoRelaxadoEsquerdo}
                                        onChange={(e) => setBracoRelaxadoEsquerdo(e.target.value)}
                                    />
                                </div>
                                <div className="w-1/2 flex flex-col items-start gap-1 justify-center">
                                    <label className="text-md font-medium text-gray-700">Braço Relaxado Direito</label>
                                    <Input
                                        classname="w-full border rounded-md px-3 py-2"
                                        placeholder="0"
                                        type="number"
                                        value={bracoRelaxadoDireito}
                                        onChange={(e) => setBracoRelaxadoDireito(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="w-3/4 flex flex-row gap-4">
                                <div className="w-1/2 flex flex-col items-start gap-1 justify-center">
                                    <label className="text-md font-medium text-gray-700">Braço Contraido Esquerdo</label>
                                    <Input
                                        classname="w-full border rounded-md px-3 py-2"
                                        placeholder="0"
                                        type="number"
                                        value={bracoContraidoEsquerdo}
                                        onChange={(e) => setBracoContraidoEsquerdo(e.target.value)}
                                    />
                                </div>
                                <div className="w-1/2 flex flex-col items-start gap-1 justify-center">
                                    <label className="text-md font-medium text-gray-700">Braço Contraido Direito</label>
                                    <Input
                                        classname="w-full border rounded-md px-3 py-2"
                                        placeholder="0"
                                        type="number"
                                        value={bracoContraidoDireito}
                                        onChange={(e) => setBracoContraidoDireito(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="w-3/4 flex flex-row gap-4  mb-4">
                                <div className="w-1/2 flex flex-col items-start gap-1 justify-center">
                                    <label className="text-md font-medium text-gray-700">Antebraço Esquerdo</label>
                                    <Input
                                        classname="w-full border rounded-md px-3 py-2"
                                        placeholder="0"
                                        type="number"
                                        value={antebraçoEsquerdo}
                                        onChange={(e) => setAntebraçoEsquerdo(e.target.value)}
                                    />
                                </div>
                                <div className="w-1/2 flex flex-col items-start gap-1 justify-center">
                                    <label className="text-md font-medium text-gray-700">Antebraço Direito</label>
                                    <Input
                                        classname="w-full border rounded-md px-3 py-2"
                                        placeholder="0"
                                        type="number"
                                        value={antebraçoDireito}
                                        onChange={(e) => setAntebraçoDireito(e.target.value)}
                                    />
                                </div>
                            </div>


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