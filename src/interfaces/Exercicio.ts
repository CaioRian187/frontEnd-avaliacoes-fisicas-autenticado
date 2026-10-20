export type GrupoMuscular =
    | "PEITO"
    | "COSTAS"
    | "OMBROS"
    | "BICEPS"
    | "TRICEPS"
    | "ANTEBRACO"
    | "QUADRICEPS"
    | "POSTERIOR_COXA"
    | "GLUTEOS"
    | "PANTURRILHA"
    | "ADUTORES"
    | "ABDUTORES"
    | "ABDOMEN"
    | "LOMBAR"
    | "TRAPECIO"
    | "CARDIO"
    | "CORPO_INTEIRO"
    | "MOBILIDADE";

// Mantem a mesma ordem/orientacao do GrupoMuscularEnum do back-end.
export const GRUPOS_MUSCULARES: GrupoMuscular[] = [
    "PEITO",
    "COSTAS",
    "OMBROS",
    "BICEPS",
    "TRICEPS",
    "ANTEBRACO",
    "QUADRICEPS",
    "POSTERIOR_COXA",
    "GLUTEOS",
    "PANTURRILHA",
    "ADUTORES",
    "ABDUTORES",
    "ABDOMEN",
    "LOMBAR",
    "TRAPECIO",
    "CARDIO",
    "CORPO_INTEIRO",
    "MOBILIDADE",
];

export const GRUPO_MUSCULAR_LABELS: Record<GrupoMuscular, string> = {
    PEITO: "Peito",
    COSTAS: "Costas",
    OMBROS: "Ombros",
    BICEPS: "Bíceps",
    TRICEPS: "Tríceps",
    ANTEBRACO: "Antebraço",
    QUADRICEPS: "Quadríceps",
    POSTERIOR_COXA: "Posterior de Coxa",
    GLUTEOS: "Glúteos",
    PANTURRILHA: "Panturrilha",
    ADUTORES: "Adutores",
    ABDUTORES: "Abdutores",
    ABDOMEN: "Abdômen",
    LOMBAR: "Lombar",
    TRAPECIO: "Trapézio",
    CARDIO: "Cardio",
    CORPO_INTEIRO: "Corpo Inteiro",
    MOBILIDADE: "Mobilidade",
};

export interface Exercicio {
    id: string;
    nome: string;
    descricao: string;
    grupoMuscular: GrupoMuscular;
    urlVideo: string;
}

export interface ExercicioRequest {
    nome: string;
    descricao: string;
    grupoMuscular: GrupoMuscular;
    urlVideo: string;
}
