import type { Request, Response } from 'express';
import { VerifyInvitationUseCase } from '../../../application/usecases/verify-invitation.usecase.js';
import { PrismaInvitationRepository } from '../../repositories/prisma/prisma-invitation.repository.js';
import { NodeCryptoProvider } from '../../../../../shared/infrastructure/providers/node-crypto.provider.js';
import { validateData } from '../../../../../shared/infrastructure/validation/zod/data-validation.js';
import { verifyInvitationRequestSchema } from '../../schemas/zod/verify-invitation.schema.js';

const verifyInvitation = new VerifyInvitationUseCase(
    new PrismaInvitationRepository(),
    new NodeCryptoProvider(),
);

export const verifyInvitationController = async (
    req: Request,
    res: Response,
) => {
    const params = validateData(req.params, verifyInvitationRequestSchema);
    const response = await verifyInvitation.execute({
        invitationToken: params.invitationToken,
    });

    return res.status(200).json(response);
};
