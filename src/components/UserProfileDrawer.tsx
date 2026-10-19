import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Usuario } from "../interfaces/Usuario";
import type { UserToken } from "../interfaces/UserToken";
import { handleLogout } from "../services/AuthService";
import { findUsuarioById } from "../services/UsuarioService";
import { getTokenDecoded } from "../utils/Auth";
import { ModalEditarAluno } from "./ModalEditarAluno";

interface UserProfileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

// Monta as iniciais do nome/login para exibir no avatar do drawer.
const obterIniciais = (nome: string): string => {
    const partes = nome.trim().split(/\s+/).filter(Boolean);

    if (partes.length === 0) return "U";

    return partes
        .slice(0, 2)
        .map((parte) => parte.charAt(0).toUpperCase())
        .join("");
};

export const UserProfileDrawer = ({ isOpen, onClose }: UserProfileDrawerProps) => {

    const navigate = useNavigate();
    const [shouldRender, setShouldRender] = useState<boolean>(isOpen);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [tokenInfo, setTokenInfo] = useState<UserToken | null>(null);
    const [isEditOpen, setIsEditOpen] = useState<boolean>(false);

    // Controla a animacao de entrada/saida mantendo o componente montado durante o fechamento.
    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            const frame = requestAnimationFrame(() => setIsVisible(true));
            return () => cancelAnimationFrame(frame);
        }

        setIsVisible(false);
        const timeout = setTimeout(() => setShouldRender(false), 300);
        return () => clearTimeout(timeout);
    }, [isOpen]);

    // Carrega os dados do usuario logado sempre que o drawer e aberto.
    useEffect(() => {
        if (!isOpen) return;

        const tokenDecoded = getTokenDecoded();
        setTokenInfo(tokenDecoded);

        if (!tokenDecoded?.id) return;

        let ativo = true;

        findUsuarioById(tokenDecoded.id)
            .then((usuarioEncontrado) => {
                if (ativo) setUsuario(usuarioEncontrado);
            })
            .catch((error: unknown) => {
                console.error("Erro ao carregar o perfil do usuário: ", error);
            });

        return () => {
            ativo = false;
        };
    }, [isOpen]);

    // Fecha o drawer ao pressionar ESC.
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!shouldRender) return null;

    const nome = usuario?.nome ?? tokenInfo?.sub ?? "Usuário";
    const login = usuario?.login ?? tokenInfo?.sub ?? "-";
    const role = usuario?.role ?? tokenInfo?.role ?? "-";
    const isAdmin = role === "ADMIN";

    const handleSair = () => {
        handleLogout();
        setIsEditOpen(false);
        onClose();
        navigate("/");
    };

    const handlePerfilAtualizado = (usuariosAtualizados: Usuario[]) => {
        const atualizado = usuariosAtualizados[0];

        if (atualizado) setUsuario(atualizado);
    };

    return (
        <>
            <div
                onClick={onClose}
                aria-hidden="true"
                className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
            />

            <aside
                role="dialog"
                aria-modal="true"
                aria-label="Perfil do usuário"
                className={`fixed inset-y-0 left-0 z-50 flex w-80 max-w-[85vw] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${isVisible ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="flex items-start justify-between gap-3 border-b border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white ${isAdmin ? "bg-blue-700" : "bg-emerald-600"}`}>
                            {obterIniciais(nome)}
                        </div>

                        <div className="min-w-0">
                            <h2 className="truncate text-lg font-bold text-gray-800">{nome}</h2>
                            <p className="truncate text-sm text-gray-500">{login}</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fechar painel de perfil"
                        className="shrink-0 rounded-xl px-2 py-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex flex-col gap-2 border-b border-gray-100 px-5 py-4">
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Papel</span>
                    <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${isAdmin ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`}>
                        {role}
                    </span>
                </div>

                <div className="flex flex-1 flex-col gap-2 p-5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Opções</span>

                    <button
                        type="button"
                        onClick={() => setIsEditOpen(true)}
                        disabled={!usuario}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-medium text-gray-700 transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <span aria-hidden="true">✎</span>
                        Editar dados do usuário
                    </button>
                </div>

                <div className="border-t border-gray-200 p-5">
                    <button
                        type="button"
                        onClick={handleSair}
                        className="w-full rounded-xl bg-red-500 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-red-600"
                    >
                        Sair
                    </button>
                </div>
            </aside>

            {isEditOpen && usuario && (
                <ModalEditarAluno
                    usuario={usuario}
                    usuarios={[usuario]}
                    setUsuarios={handlePerfilAtualizado}
                    onClose={() => setIsEditOpen(false)}
                    titulo="Editar meus dados"
                />
            )}
        </>
    );
};
