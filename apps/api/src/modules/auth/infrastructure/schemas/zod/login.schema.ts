import { z } from 'zod';

export const loginRequestSchema = z
  .object({ email: z.email(), password: z.string().min(1) })
  .meta({ example: { email: 'dev@example.com', password: 'senha-de-teste-123' } });
