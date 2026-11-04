import { z } from 'zod';

export const logoutRequestSchema = z.object({ confirma_session: z.string().min(1) });
