import { z } from 'zod';

export const getCurrentUserRequestSchema = z.object({ confirma_session: z.string().min(1) });
export const getCurrentUserResponseSchema = z.object({
  user: z.object({ id: z.string(), email: z.email() }),
});
