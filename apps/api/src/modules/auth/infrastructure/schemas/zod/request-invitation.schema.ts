import { z } from 'zod';

export const requestInvitationRequestSchema = z
    .object({ email: z.email() })
    .meta({ example: { email: 'dev@example.com' } });
export const requestInvitationResponseSchema = z
    .object({ accepted: z.boolean() })
    .meta({ example: { accepted: true } });
