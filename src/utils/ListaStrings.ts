export const LISTA_NAO = "Não";

export const listaStringsValida = (valores: string[]): boolean =>
    valores.some((valor) => valor.trim().length > 0);

export const listasObrigatoriasValidas = (deficiencias: string[], lezoes: string[]): boolean =>
    listaStringsValida(deficiencias) && listaStringsValida(lezoes);
