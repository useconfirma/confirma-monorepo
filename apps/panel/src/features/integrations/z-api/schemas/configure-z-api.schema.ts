import { z } from 'zod';

export const configureZApiSchema = z.object({
    instanceId: z.string().min(1),
    instanceToken: z.string().min(1),
    clientToken: z.string().min(1),
});

export type ConfigureZApiFormData = z.infer<typeof configureZApiSchema>;
