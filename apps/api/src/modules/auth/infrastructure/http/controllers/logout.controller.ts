import type { Request, Response } from 'express';
import { ExpressCookieProvider } from '../../../../../shared/infrastructure/providers/express-cookie.provider.js';

export const logoutController = async (req: Request, res: Response) => {
    const cookies = new ExpressCookieProvider(req, res);

    cookies.remove('confirma_session', {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    });

    return res.status(204).send();
};
