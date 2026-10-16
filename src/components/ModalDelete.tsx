
interface ModalDeleteProps {
    setIsOpenModalDelete: (isOpenModalDelete: boolean) => void;
    msg: string,
    onClickSim: () => void;
}

export const ModalDelete = ({ msg, onClickSim, setIsOpenModalDelete }: ModalDeleteProps) => {

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="flex flex-col bg-white items-center justify-center p-6 rounded-2xl shadow-lg max-w-sm w-full gap-4">

                <h2 className="text-md font-semibold text-gray-700 text-center">{msg}</h2>

                <div className="flex flex-row gap-4">
                    <div>
                        <button
                            onClick={onClickSim}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-2xl"
                        >
                            Sim
                        </button>
                    </div>
                    <button
                        onClick={() => setIsOpenModalDelete(false)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-2xl transition-colors"
                    >
                        Não
                    </button>
                </div>
            </div>
        </div>
    );
}