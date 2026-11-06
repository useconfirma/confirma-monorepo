import type { Request, Response } from 'express';
import { openApiRegistry } from '../../../../../shared/infrastructure/http/docs/openapi.js';
import { errorResponseSchema } from '../../../../../shared/infrastructure/schemas/zod/error.schema.js';
import { VerifyInvitationUseCase } from '../../../application/usecases/verify-invitation.usecase.js';
import { PrismaInvitationRepository } from '../../repositories/prisma/prisma-invitation.repository.js';
import { NodeCryptoProvider } from '../../../../../shared/infrastructure/providers/node-crypto.provider.js';
import { validateData } from '../../../../../shared/infrastructure/validation/zod/data-validation.js';
import {
    verifyInvitationRequestSchema,
    verifyInvitationResponseSchema,
} from '../../schemas/zod/verify-invitation.schema.js';

type VerifyInvitationResponseDto = { email: string };

openApiRegistry.registerPath({
    method: 'get',
    path: '/invitations/{invitationToken}',
    tags: ['Auth'],
    summary: 'Verificar convite',
    request: { params: verifyInvitationRequestSchema },
    responses: {
        200: {
            description: 'Convite disponível',
            content: {
                'application/json': { schema: verifyInvitationResponseSchema },
            },
        },
        410: {
            description: 'Convite indisponível',
            content: { 'application/json': { schema: errorResponseSchema } },
        },
    },
});

const verifyInvitation = new VerifyInvitationUseCase(
    new PrismaInvitationRepository(),
    new NodeCryptoProvider(),
);

export const verifyInvitationController = async (
    req: Request,
    res: Response,
) => {
    const params = validateData(req.params, verifyInvitationRequestSchema);
    const result = await verifyInvitation.execute({
        invitationToken: params.invitationToken,
    });
    const response: VerifyInvitationResponseDto = { email: result.email };

    return res.status(200).json(response);
};
