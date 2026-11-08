import { z } from 'zod';

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

// Espelha a validação da API-07: HH:mm, início antes do fim (BR-03) e fuso.
export const configureSendWindowSchema = z
    .object({
        start: z
            .string()
            .regex(TIME_PATTERN, { error: 'Informe o horário inicial.' }),
        end: z
            .string()
            .regex(TIME_PATTERN, { error: 'Informe o horário final.' }),
        timeZone: z.string().min(1, { error: 'Selecione o fuso horário.' }),
    })
    .refine(({ start, end }) => start < end, {
        error: 'O horário final deve ser posterior ao inicial, no mesmo dia.',
        path: ['end'],
    });

export type ConfigureSendWindowFormData = z.infer<
    typeof configureSendWindowSchema
>;
