import { logError } from "../utils/logger";
import { useEffect, useRef } from "react";

interface PdfViewerModalProps {
    pdfUrl: string;
    nomeArquivo: string;
    onClose: () => void;
    onDownload?: () => void;
}

export const PdfViewerModal = ({ pdfUrl, nomeArquivo, onClose, onDownload }: PdfViewerModalProps) => {

    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Fecha o modal ao pressionar ESC, mantendo o comportamento acessivel esperado.
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = nomeArquivo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        onDownload?.();
    };

    const handleImprimir = () => {
        const iframe = iframeRef.current;

        if (iframe?.contentWindow) {
            try {
                iframe.contentWindow.focus();
                iframe.contentWindow.print();
                return;
            } catch (error) {
                logError("Não foi possível abrir a impressão nativa: ", error);
            }
        }

        // Fallback: caso a impressao nativa nao esteja disponivel, baixa o PDF.
        handleDownload();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-[feedback-fade-in_0.2s_ease-out]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pdf-viewer-title"
        >
            <div className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-[feedback-scale-in_0.2s_ease-out]">

                <div className="flex items-center justify-between gap-4 border-b border-gray-200 px-4 py-3 sm:px-6">
                    <div className="min-w-0">
                        <h2 id="pdf-viewer-title" className="truncate text-lg font-bold text-gray-800">
                            Pré-visualização do relatório
                        </h2>
                        <p className="truncate text-sm text-gray-500">{nomeArquivo}</p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fechar pré-visualização"
                        className="shrink-0 rounded-xl px-3 py-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <div className="min-h-0 flex-1 bg-gray-100 p-2 sm:p-4">
                    <iframe
                        ref={iframeRef}
                        src={pdfUrl}
                        title="Pré-visualização do relatório em PDF"
                        className="h-full w-full rounded-xl border border-gray-200 bg-white"
                    />
                </div>

                <div className="flex flex-col gap-2 border-t border-gray-200 px-4 py-3 sm:flex-row sm:justify-end sm:px-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full rounded-xl bg-gray-200 px-4 py-2.5 font-semibold text-gray-700 transition-colors hover:bg-gray-300 sm:w-auto"
                    >
                        Cancelar / Fechar
                    </button>

                    <button
                        type="button"
                        onClick={handleDownload}
                        className="w-full rounded-xl bg-blue-500 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-blue-600 sm:w-auto"
                    >
                        Baixar PDF
                    </button>

                    <button
                        type="button"
                        onClick={handleImprimir}
                        className="w-full rounded-xl bg-blue-700 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-blue-600 sm:w-auto"
                    >
                        Imprimir / Baixar PDF
                    </button>
                </div>
            </div>
        </div>
    );
};
