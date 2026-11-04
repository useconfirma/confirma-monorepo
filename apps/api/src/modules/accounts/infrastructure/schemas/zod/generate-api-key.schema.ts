import { z } from 'zod';

export const generateApiKeyRequestSchema = z.object({ confirma_session: z.string().min(1) });

export const generateApiKeyResponseSchema = z.object({
  apiKey: z.string(),
  createdAt: z.iso.datetime(),
});
