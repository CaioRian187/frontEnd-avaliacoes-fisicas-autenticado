const PDF_SIGNATURE = "%PDF-";

export const ehPdfValido = async (blob: Blob): Promise<boolean> => {
    if (!blob || blob.size === 0) return false;

    const tipoValido = !blob.type
        || blob.type.startsWith("application/pdf")
        || blob.type === "application/octet-stream";

    if (!tipoValido) return false;

    try {
        const bytes = new Uint8Array(await blob.slice(0, PDF_SIGNATURE.length).arrayBuffer());
        const assinatura = String.fromCharCode(...bytes);

        return assinatura === PDF_SIGNATURE;
    } catch {
        return false;
    }
};
