import { z } from 'zod';

// Espelha a API-10: as três credenciais são obrigatórias em todo salvamento.
export const configureZApiSchema = z.object({
    instanceId: z
        .string()
        .trim()
        .min(1, { error: 'Informe o ID da instância.' }),
    instanceToken: z
        .string()
        .trim()
        .min(1, { error: 'Informe o token da instância.' }),
    clientToken: z.string().trim().min(1, { error: 'Informe o Client-Token.' }),
});

export type ConfigureZApiFormData = z.infer<typeof configureZApiSchema>;
