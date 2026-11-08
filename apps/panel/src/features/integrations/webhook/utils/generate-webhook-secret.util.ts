const SECRET_BYTES = 32;

// Segredo de assinatura aleatório: 32 bytes do gerador criptográfico, em hex.
export const generateWebhookSecret = () => {
    const bytes = crypto.getRandomValues(new Uint8Array(SECRET_BYTES));

    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join(
        '',
    );
};
