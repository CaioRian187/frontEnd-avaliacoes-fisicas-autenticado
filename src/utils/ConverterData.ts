
// Formata datas sem sofrer deslocamento de fuso: quando a API envia uma data
// pura (YYYY-MM-DD), os componentes sao usados diretamente em vez de new Date().
export const converterData = (data: string): string => {
    if (!data) return "";

    const dataSemHorario = /^(\d{4})-(\d{2})-(\d{2})/.exec(data);

    if (dataSemHorario) {
        const [, ano, mes, dia] = dataSemHorario;
        return `${dia}/${mes}/${ano}`;
    }

    const date = new Date(data);

    if (Number.isNaN(date.getTime())) {
        return data;
    }

    return date.toLocaleDateString("pt-BR");
}