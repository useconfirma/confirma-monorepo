import type { RequestHandler } from 'express';
import { PrismaUserRepository } from '../../../../modules/auth/infrastructure/repositories/prisma/prisma-user.repository.js';
import { JsonWebTokenProvider } from '../../providers/jsonwebtoken.provider.js';
import { env } from '../../env/index.js';
import { AppError } from '../../../domain/errors/app-error.js';
import { ExpressCookieProvider } from '../../providers/express-cookie.provider.js';

const unauthenticated = (): AppError => {
    return new AppError('UNAUTHENTICATED', 'Sessão ausente ou inválida.', 401);
};

const jwtProvider = new JsonWebTokenProvider(env.JWT_SECRET);
const userRepository = new PrismaUserRepository();

export const authenticate: RequestHandler = async (req, res, next) => {
    const cookies = new ExpressCookieProvider(req, res);
    const token = cookies.get('confirma_session');

    if (!token) {
        throw unauthenticated();
    }

    const payload = jwtProvider.verify(token);

    if (!payload?.sub) {
        throw unauthenticated();
    }

    const user = await userRepository.findById(payload.sub);

    if (!user) {
        throw unauthenticated();
    }

    req.userId = user.id;
    next();
};
