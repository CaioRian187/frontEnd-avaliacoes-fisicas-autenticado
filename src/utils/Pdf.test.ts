import { describe, expect, it } from "vitest";
import { ehPdfValido } from "./Pdf";

const criarBlob = (conteudo: string, tipo = "application/pdf") =>
    new Blob([conteudo], { type: tipo });

describe("ehPdfValido", () => {
    it("aceita um blob com assinatura PDF", async () => {
        expect(await ehPdfValido(criarBlob("%PDF-1.7\nconteudo"))).toBe(true);
    });

    it("rejeita HTML disfarcado de PDF", async () => {
        expect(await ehPdfValido(criarBlob("<html><script>alert(1)</script></html>", "text/html"))).toBe(false);
    });

    it("rejeita conteudo sem a assinatura PDF", async () => {
        expect(await ehPdfValido(criarBlob("<script>alert(1)</script>"))).toBe(false);
    });

    it("rejeita blob vazio", async () => {
        expect(await ehPdfValido(criarBlob(""))).toBe(false);
    });
});
