import { z } from 'zod';

export const getAccountRequestSchema = z.object({ confirma_session: z.string().min(1) });

export const getAccountResponseSchema = z.object({
  account: z.record(z.string(), z.unknown()),
});
