import type { RequestHandler } from 'express';
import { PrismaAccountRepository } from '../../../../modules/accounts/infrastructure/repositories/prisma/prisma-account.repository.js';
import { AppError } from '../../../domain/errors/app-error.js';

const accountRepository = new PrismaAccountRepository();

export const authorizeAccount: RequestHandler = async (req, _res, next) => {
    const account = await accountRepository.findSummaryByUserId(req.userId!);

    if (!account) {
        throw new AppError(
            'ACCOUNT_ACCESS_DENIED',
            'Acesso à account não autorizado.',
            403,
        );
    }

    req.accountId = account.id;
    next();
};
