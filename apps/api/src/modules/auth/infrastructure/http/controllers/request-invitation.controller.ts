import type { Request, Response } from 'express';
import { openApiRegistry } from '../../../../../shared/infrastructure/http/docs/openapi.js';
import { errorResponseSchema } from '../../../../../shared/infrastructure/schemas/zod/error.schema.js';
import { RequestInvitationUseCase } from '../../../application/usecases/request-invitation.usecase.js';
import { PrismaInvitationRepository } from '../../repositories/prisma/prisma-invitation.repository.js';
import { NodeCryptoProvider } from '../../../../../shared/infrastructure/providers/node-crypto.provider.js';
import { ResendMailProvider } from '../../../../../shared/infrastructure/providers/resend-mail.provider.js';
import { env } from '../../../../../shared/infrastructure/env/index.js';
import { validateData } from '../../../../../shared/infrastructure/validation/zod/data-validation.js';
import {
    requestInvitationRequestSchema,
    requestInvitationResponseSchema,
} from '../../schemas/zod/request-invitation.schema.js';

type RequestInvitationResponseDto = { accepted: boolean };

openApiRegistry.registerPath({
    method: 'post',
    path: '/invitations',
    tags: ['Auth'],
    summary: 'Solicitar convite',
    request: {
        body: {
            content: {
                'application/json': { schema: requestInvitationRequestSchema },
            },
        },
    },
    responses: {
        202: {
            description: 'Convite aceito',
            content: {
                'application/json': { schema: requestInvitationResponseSchema },
            },
        },
        400: {
            description: 'Corpo inválido',
            content: { 'application/json': { schema: errorResponseSchema } },
        },
    },
});

const requestInvitation = new RequestInvitationUseCase(
    new PrismaInvitationRepository(),
    new NodeCryptoProvider(),
    new ResendMailProvider(env.RESEND_FROM_EMAIL, env.RESEND_API_KEY),
    env.PUBLIC_APP_URL,
);

export const requestInvitationController = async (
    req: Request,
    res: Response,
) => {
    const body = validateData(req.body, requestInvitationRequestSchema);
    const result = await requestInvitation.execute({
        email: body.email,
    });
    const response: RequestInvitationResponseDto = {
        accepted: result.accepted,
    };

    return res.status(202).json(response);
};
