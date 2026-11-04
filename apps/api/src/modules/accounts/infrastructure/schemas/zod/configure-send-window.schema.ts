import { z } from 'zod';

const isoDateSchema = z.iso.datetime();

export const configureSendWindowRequestSchema = z.object({
  confirma_session: z.string().min(1),
});

export const configureSendWindowBodySchema = z.object({
  start: z.string(),
  end: z.string(),
  timeZone: z.string(),
});

export const configureSendWindowResponseSchema = z.object({
  configured: z.boolean(),
  start: z.string(),
  end: z.string(),
  timeZone: z.string(),
  updatedAt: isoDateSchema,
});
