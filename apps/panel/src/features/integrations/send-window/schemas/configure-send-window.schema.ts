import { z } from 'zod';

export const configureSendWindowSchema = z
    .object({
        start: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
        end: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
        timeZone: z.string().min(1),
    })
    .refine(({ start, end }) => start < end, {
        message: 'O horário inicial deve ser anterior ao horário final.',
        path: ['end'],
    });

export type ConfigureSendWindowFormData = z.infer<
    typeof configureSendWindowSchema
>;
