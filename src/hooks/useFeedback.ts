import { useContext } from "react";
import { FeedbackContext, type FeedbackContextValue } from "./FeedbackContext";

export const useFeedbackModal = (): FeedbackContextValue => {
    const context = useContext(FeedbackContext);

    if (!context) {
        throw new Error("useFeedbackModal deve ser usado dentro de <FeedbackProvider>.");
    }

    return context;
};
