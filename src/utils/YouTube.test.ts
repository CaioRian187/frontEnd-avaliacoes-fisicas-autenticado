import { describe, expect, it } from "vitest";
import { extrairYouTubeId, getYouTubeEmbedUrl } from "./YouTube";

describe("extrairYouTubeId", () => {
    it("extrai o id de uma URL de watch", () => {
        expect(extrairYouTubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    });

    it("extrai o id de uma URL curta", () => {
        expect(extrairYouTubeId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    });

    it("rejeita dominios que nao sao do YouTube", () => {
        expect(extrairYouTubeId("https://exemplo.com/watch?v=dQw4w9WgXcQ")).toBeNull();
    });

    it("rejeita id com formato invalido", () => {
        expect(extrairYouTubeId("https://www.youtube.com/watch?v=abc")).toBeNull();
    });

    it("rejeita protocolos nao HTTP", () => {
        expect(extrairYouTubeId("javascript:alert(1)//youtube.com/watch?v=dQw4w9WgXcQ")).toBeNull();
    });
});

describe("getYouTubeEmbedUrl", () => {
    it("monta a URL de embed no dominio oficial", () => {
        expect(getYouTubeEmbedUrl("https://youtu.be/dQw4w9WgXcQ")).toBe(
            "https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0"
        );
    });

    it("retorna null para URL invalida", () => {
        expect(getYouTubeEmbedUrl("https://exemplo.com/video")).toBeNull();
    });
});
