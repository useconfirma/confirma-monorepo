import { z } from 'zod';

export const configureWebhookSchema = z.object({
    url: z.url().refine((value) => new URL(value).protocol === 'https:', {
        message: 'A URL do webhook deve usar HTTPS.',
    }),
    secret: z.string().min(1),
});

export type ConfigureWebhookFormData = z.infer<typeof configureWebhookSchema>;
