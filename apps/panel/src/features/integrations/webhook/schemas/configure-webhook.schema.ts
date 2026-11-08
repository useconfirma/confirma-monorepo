import { z } from 'zod';

// O segredo de assinatura não é digitado: o painel o gera ao salvar.
export const configureWebhookSchema = z.object({
    url: z
        .url({ error: 'Informe uma URL válida.' })
        .refine(
            (value) =>
                URL.canParse(value) && new URL(value).protocol === 'https:',
            { message: 'A URL do webhook deve usar HTTPS.' },
        ),
});

export type ConfigureWebhookFormData = z.infer<typeof configureWebhookSchema>;
