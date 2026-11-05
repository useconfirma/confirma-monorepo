import type { RequestHandler } from 'express';
import { AppError } from '../../../domain/errors/app-error.js';
import type { AccountRepository } from '../../../../modules/accounts/domain/repositories/account.repository.js';

export type AccountAuthorizationMiddlewareDependencies = {
    accountRepository: AccountRepository;
};

export const authorizeAccount: RequestHandler = async (req, _res, next) => {
    if (!req.userId) {
        throw new AppError(
            'UNAUTHENTICATED',
            'Sessão ausente ou inválida.',
            401,
        );
    }

    const dependencies = req.app.locals.accountAuthorization as
        AccountAuthorizationMiddlewareDependencies | undefined;

    if (!dependencies) {
        throw new AppError(
            'AUTHORIZATION_NOT_CONFIGURED',
            'Autorização de account não configurada.',
            503,
        );
    }

    const account = await dependencies.accountRepository.findSummaryByUserId(
        req.userId,
    );

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
