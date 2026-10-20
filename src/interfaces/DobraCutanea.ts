export interface DobraCutanea {
    id: string | number;
    data?: string;
    biceps?: number;
    peitoral?: number;
    triceps?: number;
    subescapular?: number;
    panturrilhaMedial?: number;
    abdominal?: number;
    suprailiaca?: number;
    coxa?: number;
    relacaoCinturaQuadril?: number;
    percentualGordura?: number;
    aluno?: {
        id?: string;
        nome?: string;
        idade?: number;
        sexo?: string;
    };
}
