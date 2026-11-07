import { z } from 'zod';

export const acceptInvitationSchema = z.object({
    invitationToken: z.string().min(1),
    password: z.string().min(1),
    accountName: z.string().min(1),
});

export type AcceptInvitationFormData = z.infer<typeof acceptInvitationSchema>;
