import { z } from 'zod';

export const requestInvitationSchema = z.object({
    email: z.email({ error: 'Informe um e-mail válido.' }),
});

export type RequestInvitationFormData = z.infer<typeof requestInvitationSchema>;
