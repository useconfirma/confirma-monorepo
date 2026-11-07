import { z } from 'zod';

export const signInSchema = z.object({
    email: z.email({ error: 'Informe um e-mail válido.' }),
    password: z.string().min(1, { error: 'Informe sua senha.' }),
});

export type SignInFormData = z.infer<typeof signInSchema>;
