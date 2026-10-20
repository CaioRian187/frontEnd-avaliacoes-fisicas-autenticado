export type TipoRelatorio = "unica" | "comparativo";

export interface RelatorioPdfParams {
    alunoId: string;
    tipo: TipoRelatorio;
    dataInicial: string;
    dataFinal?: string;
}
