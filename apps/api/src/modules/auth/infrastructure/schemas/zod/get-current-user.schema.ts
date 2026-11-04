import { z } from 'zod';

export const getCurrentUserResponseSchema = z.object({
  user: z.object({ id: z.string(), email: z.email() }),
});
