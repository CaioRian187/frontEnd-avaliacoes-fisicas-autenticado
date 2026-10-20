import { useEffect } from "react";
import { getYouTubeEmbedUrl } from "../../utils/YouTube";

interface VideoModalProps {
    url: string;
    titulo: string;
    onClose: () => void;
}

export const VideoModal = ({ url, titulo, onClose }: VideoModalProps) => {

    const embedUrl = getYouTubeEmbedUrl(url, true);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    if (!embedUrl) return null;

    return (
        <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-[feedback-fade-in_0.2s_ease-out]"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                onClick={(event) => event.stopPropagation()}
                className="flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
                <div className="flex items-center justify-between gap-4 border-b border-gray-200 px-4 py-3">
                    <h2 className="truncate text-lg font-bold text-gray-800">{titulo}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fechar vídeo"
                        className="shrink-0 rounded-xl px-3 py-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <div className="aspect-video w-full bg-black">
                    <iframe
                        src={embedUrl}
                        title={titulo}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    />
                </div>
            </div>
        </div>
    );
};
