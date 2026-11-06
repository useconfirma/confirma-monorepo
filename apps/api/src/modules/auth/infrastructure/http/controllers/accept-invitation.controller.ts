import type { Request, Response } from 'express';
import { AcceptInvitationUseCase } from '../../../application/usecases/accept-invitation.usecase.js';
import { PrismaInvitationRepository } from '../../repositories/prisma/prisma-invitation.repository.js';
import { PrismaUserRepository } from '../../repositories/prisma/prisma-user.repository.js';
import { BcryptHashProvider } from '../../../../../shared/infrastructure/providers/bcrypt-hash.provider.js';
import { NodeCryptoProvider } from '../../../../../shared/infrastructure/providers/node-crypto.provider.js';
import { ResendMailProvider } from '../../../../../shared/infrastructure/providers/resend-mail.provider.js';
import { env } from '../../../../../shared/infrastructure/env/index.js';
import { validateData } from '../../../../../shared/infrastructure/validation/zod/data-validation.js';
import { acceptInvitationRequestSchema } from '../../schemas/zod/accept-invitation.schema.js';

const acceptInvitation = new AcceptInvitationUseCase(
    new PrismaInvitationRepository(),
    new PrismaUserRepository(),
    new NodeCryptoProvider(),
    new BcryptHashProvider(),
    new ResendMailProvider(env.RESEND_FROM_EMAIL, env.RESEND_API_KEY),
    env.PUBLIC_APP_URL,
);

export const acceptInvitationController = async (
    req: Request,
    res: Response,
) => {
    const body = validateData(req.body, acceptInvitationRequestSchema);
    const response = await acceptInvitation.execute(body);

    return res.status(201).json(response);
};
