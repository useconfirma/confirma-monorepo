import { z } from 'zod';

const isoDateSchema = z.iso.datetime();

export const configureSendWindowBodySchema = z
    .object({
        start: z.string(),
        end: z.string(),
        timeZone: z.string(),
    })
    .meta({
        example: {
            start: '08:00',
            end: '18:00',
            timeZone: 'America/Sao_Paulo',
        },
    });

export const configureSendWindowResponseSchema = z
    .object({
        configured: z.boolean(),
        start: z.string(),
        end: z.string(),
        timeZone: z.string(),
        updatedAt: isoDateSchema,
    })
    .meta({
        example: {
            configured: true,
            start: '08:00',
            end: '18:00',
            timeZone: 'America/Sao_Paulo',
            updatedAt: '2026-11-04T12:00:00Z',
        },
    });
