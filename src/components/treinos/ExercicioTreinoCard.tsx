import { useState } from "react";
import { GRUPO_MUSCULAR_LABELS } from "../../interfaces/Exercicio";
import type { ExercicioTreinoDraft } from "../../interfaces/Treino";
import { getYouTubeThumbnailUrl } from "../../utils/YouTube";

interface ExercicioTreinoCardProps {
    draft: ExercicioTreinoDraft;
    numero: number;
    readOnly?: boolean;
    onChange?: (draft: ExercicioTreinoDraft) => void;
    onRemove?: () => void;
    onVerVideo: () => void;
}

export const ExercicioTreinoCard = ({ draft, numero, readOnly = false, onChange, onRemove, onVerVideo }: ExercicioTreinoCardProps) => {

    const [concluido, setConcluido] = useState(false);
    const thumbnail = getYouTubeThumbnailUrl(draft.exercicio.urlVideo);

    const atualizarCampo = (
        campo: "quantidadeSeries" | "quantidadeRepeticoes" | "carga" | "tempoDescanso",
        valor: string
    ) => {
        onChange?.({ ...draft, [campo]: valor });
    };

    return (
        <div
            className={`relative flex flex-col gap-4 rounded-2xl border p-4 shadow-sm transition-colors md:flex-row ${
                concluido ? "border-green-300 bg-green-50/60" : "border-gray-200 bg-white"
            }`}
        >
            <span className="pointer-events-none absolute left-3 top-3 z-10 inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-blue-100 px-2 text-xs font-bold text-blue-700 shadow-sm ring-1 ring-white/70">
                {numero}º
            </span>

            <button
                type="button"
                onClick={onVerVideo}
                className="group relative aspect-video w-full shrink-0 overflow-hidden rounded-xl bg-gray-900 md:w-56"
                aria-label={`Ver vídeo de ${draft.exercicio.nome}`}
            >
                {thumbnail ? (
                    <img
                        src={thumbnail}
                        alt={`Vídeo de ${draft.exercicio.nome}`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-gray-300">
                        Sem vídeo
                    </div>
                )}

                <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-3xl text-white transition-colors group-hover:bg-black/40">
                    ▶
                </span>
            </button>

            <div className="flex min-w-0 flex-1 flex-col gap-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                        <h4 className="truncate text-base font-bold text-gray-800">{draft.exercicio.nome}</h4>
                        <span className="mt-1 inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                            {GRUPO_MUSCULAR_LABELS[draft.exercicio.grupoMuscular]}
                        </span>
                    </div>

                    {onRemove && (
                        <button
                            type="button"
                            onClick={onRemove}
                            aria-label={`Remover ${draft.exercicio.nome} do treino`}
                            className="shrink-0 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-600"
                        >
                            Remover
                        </button>
                    )}
                </div>

                {draft.exercicio.descricao && (
                    <p className="line-clamp-3 text-sm text-gray-600">{draft.exercicio.descricao}</p>
                )}

                {readOnly ? (
                    <div className="flex flex-wrap gap-2 text-sm">
                        <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-gray-700">
                            Séries: <strong>{draft.quantidadeSeries}</strong>
                        </span>
                        <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-gray-700">
                            Repetições: <strong>{draft.quantidadeRepeticoes}</strong>
                        </span>
                        {draft.carga && (
                            <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-gray-700">
                                Carga: <strong>{draft.carga}</strong>
                            </span>
                        )}
                        {draft.tempoDescanso.trim() !== "" && (
                            <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-gray-700">
                                Descanso: <strong>{draft.tempoDescanso}s</strong>
                            </span>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Séries</label>
                            <input
                                type="number"
                                min={1}
                                value={draft.quantidadeSeries}
                                onChange={(event) => atualizarCampo("quantidadeSeries", event.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Repetições</label>
                            <input
                                type="number"
                                min={1}
                                value={draft.quantidadeRepeticoes}
                                onChange={(event) => atualizarCampo("quantidadeRepeticoes", event.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Carga</label>
                            <input
                                type="text"
                                value={draft.carga}
                                onChange={(event) => atualizarCampo("carga", event.target.value)}
                                placeholder="Ex: 20 kg"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Descanso (s)</label>
                            <input
                                type="number"
                                min={0}
                                value={draft.tempoDescanso}
                                onChange={(event) => atualizarCampo("tempoDescanso", event.target.value)}
                                placeholder="Ex: 60"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                        </div>
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => setConcluido((anterior) => !anterior)}
                    aria-pressed={concluido}
                    className={`mt-auto flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors sm:w-auto ${
                        concluido
                            ? "border-green-300 bg-green-100 text-green-800 hover:bg-green-200"
                            : "border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                >
                    {concluido ? "Concluído ✓" : "Marcar como Concluído"}
                </button>
            </div>
        </div>
    );
};
