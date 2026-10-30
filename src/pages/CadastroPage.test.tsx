import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { CasdastroPage } from "./CadastroPage";

const mocks = vi.hoisted(() => ({
  handleCadastro: vi.fn(),
  showFeedback: vi.fn(),
  showWarning: vi.fn(),
  showError: vi.fn(),
}));

vi.mock("../services/AuthService", () => ({
  handleCadastro: mocks.handleCadastro,
}));

vi.mock("../hooks/useFeedback", () => ({
  useFeedbackModal: () => ({
    showFeedback: mocks.showFeedback,
    showWarning: mocks.showWarning,
    showError: mocks.showError,
  }),
}));

const preencherCamposBasicos = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByPlaceholderText("Informe seu nome (ex: joãozinho)"), "Ana");
  await user.type(screen.getByPlaceholderText("Informe sua idade (ex: 20)"), "20");
  await user.selectOptions(screen.getByRole("combobox"), "MULHER_CISGENERO");
  await user.type(screen.getByPlaceholderText("Informe seu login (ex: joazinho5847)"), "ana");
  await user.type(screen.getByPlaceholderText("Informe sua senha (ex: 1649464)"), "123");
};

describe("CadastroPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.handleCadastro.mockResolvedValue({});
  });

  it("envia nome, idade, gênero, login, senha, deficiências e lesões no cadastro", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <CasdastroPage />
      </MemoryRouter>
    );

    await preencherCamposBasicos(user);

    const botoesNao = screen.getAllByRole("radio", { name: "Não" });
    const botoesSim = screen.getAllByRole("radio", { name: "Sim" });

    // Deficiência: Sim + item adicionado com Enter.
    await user.click(botoesSim[0]);
    await user.type(screen.getByPlaceholderText("Descreva a deficiência"), "cegueira{Enter}");

    // Lesão: Não.
    await user.click(botoesNao[1]);

    await user.click(screen.getByRole("button", { name: "Cadastrar" }));

    expect(mocks.handleCadastro).toHaveBeenCalledTimes(1);
    expect(mocks.handleCadastro).toHaveBeenCalledWith({
      nome: "Ana",
      idade: 20,
      genero: "MULHER_CISGENERO",
      login: "ana",
      password: "123",
      deficiencias: ["cegueira"],
      lezoes: ["Não"],
    });
    expect(mocks.showFeedback).toHaveBeenCalledWith(
      expect.objectContaining({ type: "success" })
    );
  });

  it("não envia o cadastro quando as perguntas de deficiência/lesão não foram respondidas", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <CasdastroPage />
      </MemoryRouter>
    );

    await preencherCamposBasicos(user);
    await user.click(screen.getByRole("button", { name: "Cadastrar" }));

    expect(mocks.handleCadastro).not.toHaveBeenCalled();
    expect(mocks.showWarning).toHaveBeenCalledWith(
      expect.stringMatching(/deficiência e lesão/i)
    );
  });

  it("não envia o cadastro quando o modo Sim está sem itens", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <CasdastroPage />
      </MemoryRouter>
    );

    await preencherCamposBasicos(user);

    // Deficiência: Sim, porém sem adicionar nenhum item.
    await user.click(screen.getAllByRole("radio", { name: "Sim" })[0]);
    // Lesão: Não.
    await user.click(screen.getAllByRole("radio", { name: "Não" })[1]);

    await user.click(screen.getByRole("button", { name: "Cadastrar" }));

    expect(mocks.handleCadastro).not.toHaveBeenCalled();
    expect(mocks.showWarning).toHaveBeenCalledWith(
      expect.stringMatching(/deficiência e lesão/i)
    );
  });
});
