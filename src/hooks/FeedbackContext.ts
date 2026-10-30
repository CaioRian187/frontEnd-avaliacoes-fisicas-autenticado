import { createContext } from "react";
import type { FeedbackType } from "../components/common/FeedbackModal";

export interface FeedbackOptions {
    type?: FeedbackType;
    title?: string;
    message: string;
    // Callback opcional executado apos o usuario fechar o modal (ex: navegar / fechar outro modal).
    onClose?: () => void;
}

export interface FeedbackContextValue {
    showFeedback: (options: FeedbackOptions) => void;
    showSuccess: (message: string, title?: string) => void;
    showError: (message: string, title?: string) => void;
    showWarning: (message: string, title?: string) => void;
    showInfo: (message: string, title?: string) => void;
}

export const FeedbackContext = createContext<FeedbackContextValue | undefined>(undefined);
