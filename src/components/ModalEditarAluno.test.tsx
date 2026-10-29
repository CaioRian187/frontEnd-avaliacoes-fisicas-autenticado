import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModalEditarAluno } from "./ModalEditarAluno";
import type { Usuario } from "../interfaces/Usuario";

const mocks = vi.hoisted(() => ({
  updateUsuario: vi.fn(),
  showSuccess: vi.fn(),
  showWarning: vi.fn(),
  showError: vi.fn(),
}));

vi.mock("../services/UsuarioService", () => ({
  updateUsuario: mocks.updateUsuario,
}));

vi.mock("../hooks/useFeedbackModal", () => ({
  useFeedbackModal: () => ({
    showSuccess: mocks.showSuccess,
    showWarning: mocks.showWarning,
    showError: mocks.showError,
  }),
}));

const usuarioA: Usuario = {
  id: "1",
  nome: "Ana",
  idade: 20,
  genero: "MULHER_CISGENERO",
  login: "ana",
  deficiencias: ["cegueira"],
  lezoes: ["Não"],
};

const usuarioB: Usuario = {
  id: "2",
  nome: "Bruno",
  idade: 30,
  genero: "HOMEM_CISGENERO",
  login: "bruno",
  deficiencias: ["Não"],
  lezoes: ["surdez"],
};

const renderModal = (usuario: Usuario) =>
  render(
    <ModalEditarAluno
      usuario={usuario}
      usuarios={[usuario]}
      setUsuarios={vi.fn()}
      onClose={vi.fn()}
    />
  );

describe("ModalEditarAluno", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("preserva as listas existentes e envia deficiências/lesões no PUT", async () => {
    const user = userEvent.setup();
    mocks.updateUsuario.mockResolvedValue({
      ...usuarioA,
      deficiencias: ["cegueira", "surdez"],
    });

    renderModal(usuarioA);

    const botoesNao = screen.getAllByRole("radio", { name: "Não" });
    const botoesSim = screen.getAllByRole("radio", { name: "Sim" });

    expect(botoesSim[0]).toBeChecked();
    expect(botoesNao[0]).not.toBeChecked();
    expect(screen.getByText("cegueira")).toBeInTheDocument();

    expect(botoesNao[1]).toBeChecked();
    expect(botoesSim[1]).not.toBeChecked();

    // Adiciona um novo item mantendo o item que já existia.
    await user.type(screen.getByPlaceholderText("Descreva a deficiência"), "surdez{Enter}");
    await user.click(screen.getByRole("button", { name: "Salvar Alterações" }));

    await waitFor(() => {
      expect(mocks.updateUsuario).toHaveBeenCalledWith("1", {
        nome: "Ana",
        idade: 20,
        genero: "MULHER_CISGENERO",
        deficiencias: ["cegueira", "surdez"],
        lezoes: ["Não"],
      });
    });
  });

  it("remonta o estado ao trocar o usuário em edição", () => {
    const { rerender } = renderModal(usuarioA);

    expect(screen.getAllByRole("radio", { name: "Sim" })[0]).toBeChecked();
    expect(screen.getByText("cegueira")).toBeInTheDocument();
    expect(screen.getAllByRole("radio", { name: "Não" })[1]).toBeChecked();

    rerender(
      <ModalEditarAluno
        usuario={usuarioB}
        usuarios={[usuarioB]}
        setUsuarios={vi.fn()}
        onClose={vi.fn()}
      />
    );

    const botoesNao = screen.getAllByRole("radio", { name: "Não" });
    const botoesSim = screen.getAllByRole("radio", { name: "Sim" });

    // Deficiência do usuário B: "Não".
    expect(botoesNao[0]).toBeChecked();
    expect(botoesSim[0]).not.toBeChecked();
    expect(screen.queryByText("cegueira")).not.toBeInTheDocument();

    // Lesão do usuário B: Sim + item existente.
    expect(botoesSim[1]).toBeChecked();
    expect(botoesNao[1]).not.toBeChecked();
    expect(screen.getByText("surdez")).toBeInTheDocument();
  });
});
