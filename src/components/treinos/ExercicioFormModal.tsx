import { useEffect, useState, type FormEvent } from "react";
import { GRUPO_MUSCULAR_LABELS, GRUPOS_MUSCULARES, type Exercicio, type ExercicioRequest, type GrupoMuscular } from "../../interfaces/Exercicio";
import { createExercicio, deleteExercicio, updateExercicio } from "../../services/ExercicioService";
import { useFeedbackModal } from "../../hooks/useFeedbackModal";
import { extrairMensagemErro } from "../../utils/ErrorUtils";

interface ExercicioFormModalProps {
    isOpen: boolean;
    exercicio?: Exercicio | null;
    onClose: () => void;
    onSaved: (exercicio: Exercicio) => void;
    onDeleted?: (exercicioId: string) => void;
}

export const ExercicioFormModal = ({ isOpen, exercicio, onClose, onSaved, onDeleted }: ExercicioFormModalProps) => {

    const { showSuccess, showWarning, showError } = useFeedbackModal();
    const [nome, setNome] = useState<string>("");
    const [descricao, setDescricao] = useState<string>("");
    const [grupoMuscular, setGrupoMuscular] = useState<GrupoMuscular>("PEITO");
    const [urlVideo, setUrlVideo] = useState<string>("");
    const [salvando, setSalvando] = useState<boolean>(false);

    useEffect(() => {
        if (!isOpen) return;

        setNome(exercicio?.nome ?? "");
        setDescricao(exercicio?.descricao ?? "");
        setGrupoMuscular(exercicio?.grupoMuscular ?? "PEITO");
        setUrlVideo(exercicio?.urlVideo ?? "");
    }, [isOpen, exercicio]);

    if (!isOpen) return null;

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!nome.trim() || !descricao.trim() || !urlVideo.trim()) {
            showWarning("Preencha nome, descrição e URL do vídeo.");
            return;
        }

        const request: ExercicioRequest = {
            nome: nome.trim(),
            descricao: descricao.trim(),
            grupoMuscular,
            urlVideo: urlVideo.trim(),
        };

        setSalvando(true);

        try {
            const salvo = exercicio
                ? await updateExercicio(exercicio.id, request)
                : await createExercicio(request);

            onSaved(salvo);
            showSuccess(exercicio ? "Exercício atualizado com sucesso!" : "Exercício cadastrado com sucesso!");
            onClose();
        } catch (error) {
            console.error("Erro ao salvar exercício: ", error);
            showError(extrairMensagemErro(error, "Não foi possível salvar o exercício."));
        } finally {
            setSalvando(false);
        }
    };

    const handleExcluir = async () => {
        if (!exercicio || !onDeleted) return;

        setSalvando(true);

        try {
            await deleteExercicio(exercicio.id);
            onDeleted(exercicio.id);
            showSuccess("Exercício removido do catálogo.");
            onClose();
        } catch (error) {
            console.error("Erro ao excluir exercício: ", error);
            showError(extrairMensagemErro(error, "Não foi possível excluir o exercício. Ele pode estar vinculado a um treino."));
        } finally {
            setSalvando(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
            >
                <h2 className="mb-4 text-xl font-bold text-gray-800">
                    {exercicio ? "Editar Exercício" : "Novo Exercício"}
                </h2>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Nome do exercício</label>
                        <input
                            type="text"
                            value={nome}
                            onChange={(event) => setNome(event.target.value)}
                            placeholder="Ex: Supino reto com barra"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Grupo muscular</label>
                        <select
                            value={grupoMuscular}
                            onChange={(event) => setGrupoMuscular(event.target.value as GrupoMuscular)}
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        >
                            {GRUPOS_MUSCULARES.map((grupo) => (
                                <option key={grupo} value={grupo}>
                                    {GRUPO_MUSCULAR_LABELS[grupo]}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Descrição</label>
                        <textarea
                            value={descricao}
                            onChange={(event) => setDescricao(event.target.value)}
                            rows={3}
                            placeholder="Descreva a execução do exercício"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">URL do vídeo no YouTube</label>
                        <input
                            type="text"
                            value={urlVideo}
                            onChange={(event) => setUrlVideo(event.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                </div>

                <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                    <button
                        type="submit"
                        disabled={salvando}
                        className="w-full rounded-md bg-blue-700 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {salvando ? "Salvando..." : "Salvar"}
                    </button>

                    {exercicio && onDeleted && (
                        <button
                            type="button"
                            onClick={handleExcluir}
                            disabled={salvando}
                            className="w-full rounded-md bg-red-500 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                        >
                            Excluir
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full rounded-md bg-gray-200 px-4 py-2.5 font-semibold text-gray-700 transition-colors hover:bg-gray-300 sm:w-auto"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};
