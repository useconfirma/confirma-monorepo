import { z } from 'zod';

export const acceptInvitationRequestSchema = z.object({
  invitationToken: z.string().min(1),
  password: z.string().min(1),
  accountName: z.string().min(1),
});

export const acceptInvitationResponseSchema = z.object({
  user: z.object({ id: z.string(), email: z.email() }),
  account: z.object({ id: z.string(), name: z.string() }),
});
