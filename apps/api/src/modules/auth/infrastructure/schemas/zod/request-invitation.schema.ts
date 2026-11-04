import { z } from 'zod';

export const requestInvitationRequestSchema = z.object({ email: z.email() });
export const requestInvitationResponseSchema = z.object({ accepted: z.boolean() });
