import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CampoListaStrings } from "./CampoListaStrings";

interface HarnessProps {
  valoresIniciais?: string[];
  onSubmit?: (valores: string[]) => void;
  onChangeSpy?: (valores: string[]) => void;
}

// Harness controla os valores como o formulario real faz, permitindo validar
// o payload no submit e o comportamento de lista controlada.
const Harness = ({
  valoresIniciais = [],
  onSubmit = () => undefined,
  onChangeSpy,
}: HarnessProps) => {
  const [valores, setValores] = useState(valoresIniciais);

  const handleChange = (novosValores: string[]) => {
    setValores(novosValores);
    onChangeSpy?.(novosValores);
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(valores);
      }}
    >
      <CampoListaStrings
        pergunta="Possui alguma deficiência?"
        placeholder="Descreva a deficiência"
        valores={valores}
        onChange={handleChange}
      />
      <button type="submit">Salvar</button>
    </form>
  );
};

const obterRadios = () => ({
  nao: screen.getByRole("radio", { name: "Não" }),
  sim: screen.getByRole("radio", { name: "Sim" }),
});

const obterInput = () => screen.getByPlaceholderText("Descreva a deficiência");
const obterItens = () => screen.queryAllByRole("listitem");

describe("CampoListaStrings", () => {
  it("não seleciona nenhuma opção quando a lista está vazia", () => {
    render(<Harness />);

    const { nao, sim } = obterRadios();

    expect(nao).not.toBeChecked();
    expect(sim).not.toBeChecked();
    expect(screen.queryByPlaceholderText("Descreva a deficiência")).not.toBeInTheDocument();
  });

  it("define ['Não'] ao clicar em Não e envia essa lista no submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<Harness onSubmit={onSubmit} />);

    const { nao } = obterRadios();
    await user.click(nao);

    expect(nao).toBeChecked();
    expect(screen.queryByPlaceholderText("Descreva a deficiência")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Salvar" }));

    expect(onSubmit).toHaveBeenCalledWith(["Não"]);
  });

  it("limpa o 'Não' ao clicar em Sim e permite adicionar itens", async () => {
    const user = userEvent.setup();
    const onChangeSpy = vi.fn();

    render(<Harness valoresIniciais={["Não"]} onChangeSpy={onChangeSpy} />);

    const { nao, sim } = obterRadios();
    expect(nao).toBeChecked();

    await user.click(sim);

    expect(sim).toBeChecked();
    expect(nao).not.toBeChecked();
    expect(onChangeSpy).toHaveBeenLastCalledWith([]);
    expect(obterInput()).toBeInTheDocument();
    expect(obterItens()).toHaveLength(0);
  });

  it("adiciona com Enter sem submeter o formulário", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<Harness onSubmit={onSubmit} />);

    await user.click(obterRadios().sim);
    await user.type(obterInput(), "cegueira{Enter}");

    expect(obterItens()).toHaveLength(1);
    expect(screen.getByText("cegueira")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(obterInput()).toHaveValue("");
  });

  it("bloqueia itens duplicados sem diferenciar maiúsculas e minúsculas", async () => {
    const user = userEvent.setup();

    render(<Harness />);

    await user.click(obterRadios().sim);

    const input = obterInput();

    await user.type(input, "Cegueira{Enter}");
    expect(obterItens()).toHaveLength(1);

    await user.type(input, "cegueira{Enter}");
    expect(obterItens()).toHaveLength(1);

    await user.clear(input);
    await user.type(input, "  CEGUEIRA  {Enter}");
    expect(obterItens()).toHaveLength(1);
    expect(screen.getAllByText(/cegueira/i)).toHaveLength(1);
  });

  it("remove o item pelo índice correspondente", async () => {
    const user = userEvent.setup();

    render(<Harness />);

    await user.click(obterRadios().sim);
    await user.type(obterInput(), "cegueira{Enter}");
    await user.type(obterInput(), "surdez{Enter}");

    expect(obterItens()).toHaveLength(2);

    await user.click(screen.getByRole("button", { name: "Remover cegueira" }));

    expect(obterItens()).toHaveLength(1);
    expect(screen.queryByText("cegueira")).not.toBeInTheDocument();
    expect(screen.getByText("surdez")).toBeInTheDocument();
  });

  it("exibe aviso quando o modo Sim está sem itens", async () => {
    const user = userEvent.setup();

    render(<Harness />);

    await user.click(obterRadios().sim);

    expect(obterInput()).toBeInTheDocument();
    expect(screen.getByText(/Adicione ao menos um item/i)).toBeInTheDocument();
  });

  it("inicializa Sim e a lista quando já existem itens", () => {
    render(<Harness valoresIniciais={["cegueira", "surdez"]} />);

    const { nao, sim } = obterRadios();

    expect(sim).toBeChecked();
    expect(nao).not.toBeChecked();
    expect(obterItens()).toHaveLength(2);
    expect(screen.getByText("cegueira")).toBeInTheDocument();
    expect(screen.getByText("surdez")).toBeInTheDocument();
  });
});
