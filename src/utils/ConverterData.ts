
export const converterData = (data: string): string => {
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR');
}