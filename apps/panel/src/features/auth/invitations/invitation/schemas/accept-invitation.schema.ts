import { z } from 'zod';

export const acceptInvitationSchema = z
    .object({
        accountName: z
            .string()
            .trim()
            .min(1, { error: 'Informe o nome da conta.' }),
        password: z.string().min(1, { error: 'Informe uma senha.' }),
        confirmPassword: z.string().min(1, { error: 'Confirme sua senha.' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        error: 'As senhas não conferem.',
        path: ['confirmPassword'],
    });

export type AcceptInvitationFormData = z.infer<typeof acceptInvitationSchema>;
