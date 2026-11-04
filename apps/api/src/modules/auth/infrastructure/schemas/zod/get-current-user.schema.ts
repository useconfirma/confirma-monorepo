import { z } from 'zod';

export const getCurrentUserResponseSchema = z
  .object({
    user: z.object({ id: z.string(), email: z.email() }),
  })
  .meta({ example: { user: { id: 'user_123', email: 'dev@example.com' } } });
