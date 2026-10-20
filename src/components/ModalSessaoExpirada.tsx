import React from "react";

interface ModalSessaoExpiradaProps {
  isOpen: boolean;
  onConfirm: () => void;
}

export const ModalSessaoExpirada: React.FC<ModalSessaoExpiradaProps> = ({
  isOpen,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex flex-col bg-white items-center justify-center p-6 rounded-2xl shadow-lg max-w-sm w-full gap-4 text-center">
        <h2 className="text-lg font-semibold text-gray-800">
          Sua sessão encerrou
        </h2>
        <p className="text-sm text-gray-600">
          Por favor, faça login novamente para continuar.
        </p>
        <button
          onClick={onConfirm}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-xl transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  );
};
