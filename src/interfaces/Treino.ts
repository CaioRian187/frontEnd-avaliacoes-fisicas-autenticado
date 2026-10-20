import type { Exercicio, GrupoMuscular } from "./Exercicio";

export type DiaSemana =
    | "SEGUNDA"
    | "TERCA"
    | "QUARTA"
    | "QUINTA"
    | "SEXTA"
    | "SABADO"
    | "DOMINGO";

export const DIAS_SEMANA: DiaSemana[] = [
    "SEGUNDA",
    "TERCA",
    "QUARTA",
    "QUINTA",
    "SEXTA",
    "SABADO",
    "DOMINGO",
];

export const DIA_SEMANA_LABELS: Record<DiaSemana, string> = {
    SEGUNDA: "Segunda",
    TERCA: "Terça",
    QUARTA: "Quarta",
    QUINTA: "Quinta",
    SEXTA: "Sexta",
    SABADO: "Sábado",
    DOMINGO: "Domingo",
};

export const DIA_SEMANA_ABREVIADO: Record<DiaSemana, string> = {
    SEGUNDA: "Seg",
    TERCA: "Ter",
    QUARTA: "Qua",
    QUINTA: "Qui",
    SEXTA: "Sex",
    SABADO: "Sáb",
    DOMINGO: "Dom",
};

const DIA_SEMANA_POR_INDICE_JS: DiaSemana[] = [
    "DOMINGO",
    "SEGUNDA",
    "TERCA",
    "QUARTA",
    "QUINTA",
    "SEXTA",
    "SABADO",
];

export const getDiaSemanaAtual = (): DiaSemana => DIA_SEMANA_POR_INDICE_JS[new Date().getDay()];

export interface TreinoExercicioItem {
    id: string;
    exercicioId: string;
    nomeExercicio: string;
    grupoMuscular: GrupoMuscular;
    quantidadeSeries: number;
    quantidadeRepeticoes: number;
    carga?: string;
    tempoDescanso?: number | null;
}

export interface Treino {
    id: string;
    nomeTreino: string;
    observacoes?: string;
    diaSemana: DiaSemana;
    alunoId: string;
    nomeAluno?: string;
    exercicios: TreinoExercicioItem[];
}

export interface TreinoExercicioRequest {
    exercicioId: string;
    quantidadeSeries: number;
    quantidadeRepeticoes: number;
    carga?: string;
    tempoDescanso?: number;
}

export interface TreinoRequest {
    nomeTreino: string;
    observacoes: string;
    diaSemana: DiaSemana;
    alunoId: string;
    exercicios: TreinoExercicioRequest[];
}

// Estrutura usada no formulario enquanto os campos numericos ainda sao strings.
export interface ExercicioTreinoDraft {
    exercicio: Exercicio;
    quantidadeSeries: string;
    quantidadeRepeticoes: string;
    carga: string;
    tempoDescanso: string;
}
