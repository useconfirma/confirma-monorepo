import { z } from 'zod';

export const verifyInvitationRequestSchema = z
  .object({ invitationToken: z.string().min(1) })
  .meta({ example: { invitationToken: 'invitation-token-test-123' } });
export const verifyInvitationResponseSchema = z
  .object({ email: z.email() })
  .meta({ example: { email: 'dev@example.com' } });
