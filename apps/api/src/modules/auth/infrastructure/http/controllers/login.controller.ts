import type { Request, Response } from 'express';
import { LoginUseCase } from '../../../application/usecases/login.usecase.js';
import { PrismaUserRepository } from '../../repositories/prisma/prisma-user.repository.js';
import { BcryptHashProvider } from '../../../../../shared/infrastructure/providers/bcrypt-hash.provider.js';
import { JsonWebTokenProvider } from '../../../../../shared/infrastructure/providers/jsonwebtoken.provider.js';
import { env } from '../../../../../shared/infrastructure/env/index.js';
import { validateData } from '../../../../../shared/infrastructure/validation/zod/data-validation.js';
import { ExpressCookieProvider } from '../../../../../shared/infrastructure/providers/express-cookie.provider.js';
import { loginRequestSchema } from '../../schemas/zod/login.schema.js';

const login = new LoginUseCase(
    new PrismaUserRepository(),
    new BcryptHashProvider(),
    new JsonWebTokenProvider(env.JWT_SECRET),
);

export const loginController = async (req: Request, res: Response) => {
    const body = validateData(req.body, loginRequestSchema);
    const result = await login.execute(body);
    const cookies = new ExpressCookieProvider(req, res);

    cookies.set('confirma_session', result.sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: result.expiresAt.getTime() - Date.now(),
    });

    return res.status(204).send();
};
