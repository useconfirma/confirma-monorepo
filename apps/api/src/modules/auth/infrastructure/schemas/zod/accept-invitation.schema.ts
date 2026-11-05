import { z } from 'zod';

export const acceptInvitationRequestSchema = z
    .object({
        invitationToken: z.string().min(1),
        password: z.string().min(1),
        accountName: z.string().min(1),
    })
    .meta({
        example: {
            invitationToken: 'invitation-token-test-123',
            password: 'senha-de-teste-123',
            accountName: 'Clínica Teste',
        },
    });

export const acceptInvitationResponseSchema = z
    .object({
        user: z.object({ id: z.string(), email: z.email() }),
        account: z.object({ id: z.string(), name: z.string() }),
    })
    .meta({
        example: {
            user: { id: 'user_123', email: 'dev@example.com' },
            account: { id: 'acc_123', name: 'Clínica Teste' },
        },
    });
