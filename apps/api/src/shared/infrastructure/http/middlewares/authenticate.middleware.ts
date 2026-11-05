import type { RequestHandler } from 'express';
import { AppError } from '../../../domain/errors/app-error.js';
import type { CookieProvider } from '../../../../modules/auth/domain/providers/cookie-provider.js';
import type { JwtProvider } from '../../../../modules/auth/domain/providers/jwt-provider.js';
import type { UserRepository } from '../../../../modules/auth/domain/repositories/user.repository.js';

export type AuthenticationMiddlewareDependencies = {
    cookieProvider: CookieProvider;
    jwtProvider: JwtProvider;
    userRepository: UserRepository;
};

const unauthenticated = (): AppError => {
    return new AppError('UNAUTHENTICATED', 'Sessão ausente ou inválida.', 401);
};

export const authenticate: RequestHandler = async (req, _res, next) => {
    const dependencies = req.app.locals.auth as
        AuthenticationMiddlewareDependencies | undefined;

    if (!dependencies) {
        throw new AppError(
            'AUTHENTICATION_NOT_CONFIGURED',
            'Autenticação não configurada.',
            503,
        );
    }

    const token = dependencies.cookieProvider.get('confirma_session');

    if (!token) {
        throw unauthenticated();
    }

    const payload = dependencies.jwtProvider.verify(token);

    if (!payload?.sub) {
        throw unauthenticated();
    }

    const user = await dependencies.userRepository.findById(payload.sub);

    if (!user) {
        throw unauthenticated();
    }

    req.userId = user.id;
    next();
};
