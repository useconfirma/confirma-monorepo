import type { Request, Response } from 'express';
import { RequestInvitationUseCase } from '../../../application/usecases/request-invitation.usecase.js';
import { PrismaInvitationRepository } from '../../repositories/prisma/prisma-invitation.repository.js';
import { NodeCryptoProvider } from '../../../../../shared/infrastructure/providers/node-crypto.provider.js';
import { ResendMailProvider } from '../../../../../shared/infrastructure/providers/resend-mail.provider.js';
import { env } from '../../../../../shared/infrastructure/env/index.js';
import { validateData } from '../../../../../shared/infrastructure/validation/zod/data-validation.js';
import { requestInvitationRequestSchema } from '../../schemas/zod/request-invitation.schema.js';

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
    const response = await requestInvitation.execute({
        email: body.email,
    });

    return res.status(202).json(response);
};
