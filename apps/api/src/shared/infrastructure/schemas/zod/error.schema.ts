import { z } from 'zod';

export const errorResponseSchema = z
  .object({
    error: z.object({
      code: z.string(),
      message: z.string(),
    }),
  })
  .meta({
    example: {
      error: { code: 'invalid_request', message: 'Dados inválidos.' },
    },
  });
