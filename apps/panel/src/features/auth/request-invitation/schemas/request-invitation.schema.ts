import { z } from 'zod';

export const requestInvitationSchema = z.object({
    email: z.email(),
});

export type RequestInvitationFormData = z.infer<typeof requestInvitationSchema>;
