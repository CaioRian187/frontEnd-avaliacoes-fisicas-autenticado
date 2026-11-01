const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const YOUTUBE_HOSTS = new Set([
    "youtube.com",
    "m.youtube.com",
    "music.youtube.com",
    "youtu.be",
]);

const normalizarUrl = (url: string): string => {
    const possuiProtocolo = /^[a-z][a-z0-9+.-]*:/i.test(url);

    return possuiProtocolo ? url : `https://${url}`;
};

export const extrairYouTubeId = (url: string): string | null => {
    if (!url) return null;

    let parsed: URL;

    try {
        parsed = new URL(normalizarUrl(url.trim()));
    } catch {
        return null;
    }

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return null;
    }

    const host = parsed.hostname.replace(/^www\./, "");

    if (!YOUTUBE_HOSTS.has(host)) {
        return null;
    }

    if (host === "youtu.be") {
        const correspondencia = parsed.pathname.match(/^\/([A-Za-z0-9_-]{11})(?:[/?#]|$)/);
        return correspondencia?.[1] ?? null;
    }

    const porCaminho = parsed.pathname.match(
        /\/(?:embed|shorts|live)\/([A-Za-z0-9_-]{11})(?:[/?#]|$)/
    );

    if (porCaminho?.[1]) {
        return porCaminho[1];
    }

    const videoId = parsed.searchParams.get("v");

    if (videoId && YOUTUBE_ID_PATTERN.test(videoId)) {
        return videoId;
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
