// Extrai o ID do vídeo a partir das variações de URL aceitas pelo YouTube.
export const extrairYouTubeId = (url: string): string | null => {
    if (!url) return null;

    const padrao = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
    const correspondencia = padrao.exec(url);

    if (correspondencia?.[1]) {
        return correspondencia[1];
    }

    try {
        const parsed = new URL(url);
        const videoId = parsed.searchParams.get("v");

        if (videoId) return videoId;
    } catch {
        return null;
    }

    return null;
};

export const getYouTubeEmbedUrl = (url: string, autoplay = false): string | null => {
    const id = extrairYouTubeId(url);

    if (!id) return null;

    const params = autoplay ? "?autoplay=1&rel=0" : "?rel=0";

    return `https://www.youtube.com/embed/${id}${params}`;
};

export const getYouTubeThumbnailUrl = (url: string): string | null => {
    const id = extrairYouTubeId(url);

    if (!id) return null;

    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
};
