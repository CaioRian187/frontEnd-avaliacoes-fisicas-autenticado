import { useEffect, type ReactElement } from "react";

export type FeedbackType = "success" | "error" | "warning" | "info";

export interface FeedbackModalProps {
    isOpen: boolean;
    type?: FeedbackType;
    title?: string;
    message: string;
    onClose: () => void;
}

interface FeedbackStyle {
    defaultTitle: string;
    iconWrapper: string;
    titleColor: string;
    button: string;
    Icon: () => ReactElement;
}

// Icones em SVG inline para nao depender de libs externas de icones.
const CheckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true">
        <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CloseIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true">
        <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const WarningIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true">
        <path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const InfoIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path d="M12 11v5m0-8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const FEEDBACK_STYLES: Record<FeedbackType, FeedbackStyle> = {
    success: {
        defaultTitle: "Tudo certo!",
        iconWrapper: "bg-green-100 text-green-600",
        titleColor: "text-green-700",
        button: "bg-green-600 hover:bg-green-700 focus-visible:outline-green-600",
        Icon: CheckIcon,
    },
    error: {
        defaultTitle: "Ocorreu um erro",
        iconWrapper: "bg-red-100 text-red-600",
        titleColor: "text-red-700",
        button: "bg-red-600 hover:bg-red-700 focus-visible:outline-red-600",
        Icon: CloseIcon,
    },
    warning: {
        defaultTitle: "Atenção",
        iconWrapper: "bg-amber-100 text-amber-600",
        titleColor: "text-amber-700",
        button: "bg-amber-500 hover:bg-amber-600 focus-visible:outline-amber-500",
        Icon: WarningIcon,
    },
    info: {
        defaultTitle: "Informação",
        iconWrapper: "bg-blue-100 text-blue-600",
        titleColor: "text-blue-700",
        button: "bg-blue-600 hover:bg-blue-700 focus-visible:outline-blue-600",
        Icon: InfoIcon,
    },
};

export const FeedbackModal = ({
    isOpen,
    type = "info",
    title,
    message,
    onClose,
}: FeedbackModalProps) => {

    // Fecha o modal ao pressionar ESC, mantendo o comportamento acessivel esperado.
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const style = FEEDBACK_STYLES[type];
    const { Icon } = style;

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-[feedback-fade-in_0.2s_ease-out]"
            onClick={onClose}
            role="alertdialog"
            aria-modal="true"
        >
            <div
                onClick={(event) => event.stopPropagation()}
                className="flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl bg-white p-6 text-center shadow-2xl animate-[feedback-scale-in_0.2s_ease-out] sm:max-w-md sm:p-8"
            >
                <div className={`flex h-16 w-16 items-center justify-center rounded-full ${style.iconWrapper}`}>
                    <Icon />
                </div>

                <h2 className={`text-xl font-bold ${style.titleColor}`}>
                    {title ?? style.defaultTitle}
                </h2>

                <p className="text-sm leading-relaxed text-gray-600">
                    {message}
                </p>

                <button
                    type="button"
                    onClick={onClose}
                    className={`mt-2 w-full rounded-xl px-4 py-2.5 font-semibold text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${style.button}`}
                >
                    OK
                </button>
            </div>
        </div>
    );
};
