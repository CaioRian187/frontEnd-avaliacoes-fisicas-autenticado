import {
    useCallback,
    useMemo,
    useState,
    type PropsWithChildren,
} from "react";
import { FeedbackModal, type FeedbackType } from "../components/common/FeedbackModal";
import {
    FeedbackContext,
    type FeedbackContextValue,
    type FeedbackOptions,
} from "./FeedbackContext";

interface FeedbackState {
    isOpen: boolean;
    type: FeedbackType;
    title?: string;
    message: string;
    onClose?: () => void;
}

export const FeedbackProvider = ({ children }: PropsWithChildren) => {

    const [feedback, setFeedback] = useState<FeedbackState | null>(null);

    const showFeedback = useCallback((options: FeedbackOptions) => {
        setFeedback({
            isOpen: true,
            type: options.type ?? "info",
            title: options.title,
            message: options.message,
            onClose: options.onClose,
        });
    }, []);

    const handleClose = useCallback(() => {
        feedback?.onClose?.();
        setFeedback(null);
    }, [feedback]);

    const value = useMemo<FeedbackContextValue>(() => ({
        showFeedback,
        showSuccess: (message, title) => showFeedback({ type: "success", title, message }),
        showError: (message, title) => showFeedback({ type: "error", title, message }),
        showWarning: (message, title) => showFeedback({ type: "warning", title, message }),
        showInfo: (message, title) => showFeedback({ type: "info", title, message }),
    }), [showFeedback]);

    return (
        <FeedbackContext.Provider value={value}>
            {children}
            <FeedbackModal
                isOpen={feedback?.isOpen ?? false}
                type={feedback?.type}
                title={feedback?.title}
                message={feedback?.message ?? ""}
                onClose={handleClose}
            />
        </FeedbackContext.Provider>
    );
};
