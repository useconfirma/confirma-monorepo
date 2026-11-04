import { z } from 'zod';

export const generateApiKeyResponseSchema = z.object({
  apiKey: z.string(),
  createdAt: z.iso.datetime(),
});
