import { z } from 'zod';

export const verifyInvitationRequestSchema = z.object({ invitationToken: z.string().min(1) });
export const verifyInvitationResponseSchema = z.object({ email: z.email() });
