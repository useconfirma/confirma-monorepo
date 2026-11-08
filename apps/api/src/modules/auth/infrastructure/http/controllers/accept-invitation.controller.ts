import type { Request, Response } from 'express';
import { openApiRegistry } from '../../../../../shared/infrastructure/http/docs/openapi.js';
import { errorResponseSchema } from '../../../../../shared/infrastructure/schemas/zod/error.schema.js';
import { AcceptInvitationUseCase } from '../../../application/usecases/accept-invitation.usecase.js';
import { PrismaInvitationRepository } from '../../repositories/prisma/prisma-invitation.repository.js';
import { PrismaUserRepository } from '../../repositories/prisma/prisma-user.repository.js';
import { BcryptHashProvider } from '../../../../../shared/infrastructure/providers/bcrypt-hash.provider.js';
import { JsonWebTokenProvider } from '../../../../../shared/infrastructure/providers/jsonwebtoken.provider.js';
import { NodeCryptoProvider } from '../../../../../shared/infrastructure/providers/node-crypto.provider.js';
import { ResendMailProvider } from '../../../../../shared/infrastructure/providers/resend-mail.provider.js';
import { env } from '../../../../../shared/infrastructure/env/index.js';
import { validateData } from '../../../../../shared/infrastructure/validation/zod/data-validation.js';
import {
    acceptInvitationRequestSchema,
    acceptInvitationResponseSchema,
} from '../../schemas/zod/accept-invitation.schema.js';

type AcceptInvitationResponseDto = {
    user: { id: string; email: string };
    account: { id: string; name: string };
};

openApiRegistry.registerPath({
    method: 'post',
    path: '/accounts',
    tags: ['Auth'],
    summary: 'Aceitar convite e criar account',
    request: {
        body: {
            content: {
                'application/json': { schema: acceptInvitationRequestSchema },
            },
        },
    },
    responses: {
        201: {
            description: 'Account criada e sessão iniciada',
            content: {
                'application/json': { schema: acceptInvitationResponseSchema },
            },
        },
        409: {
            description: 'E-mail já cadastrado',
            content: { 'application/json': { schema: errorResponseSchema } },
        },
        410: {
            description: 'Convite indisponível',
            content: { 'application/json': { schema: errorResponseSchema } },
        },
        422: {
            description: 'Dados inválidos',
            content: { 'application/json': { schema: errorResponseSchema } },
        },
    },
});

const acceptInvitation = new AcceptInvitationUseCase(
    new PrismaInvitationRepository(),
    new PrismaUserRepository(),
    new NodeCryptoProvider(),
    new BcryptHashProvider(),
    new JsonWebTokenProvider(env.JWT_SECRET),
    new ResendMailProvider(env.RESEND_FROM_EMAIL, env.RESEND_API_KEY),
    env.PUBLIC_APP_URL,
);

export const acceptInvitationController = async (
    req: Request,
    res: Response,
) => {
    const body = validateData(req.body, acceptInvitationRequestSchema);
    const result = await acceptInvitation.execute(body);

    res.cookie('confirma_session', result.sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: result.expiresAt.getTime() - Date.now(),
    });

    const response: AcceptInvitationResponseDto = {
        user: { id: result.user.id, email: result.user.email },
        account: { id: result.account.id, name: result.account.name },
    };

    return res.status(201).json(response);
};
