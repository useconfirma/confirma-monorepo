import type { Request, Response } from 'express';
import { openApiRegistry } from '../../../../../shared/infrastructure/http/docs/openapi.js';
import { errorResponseSchema } from '../../../../../shared/infrastructure/schemas/zod/error.schema.js';

openApiRegistry.registerPath({
    method: 'delete',
    path: '/sessions/current',
    tags: ['Auth'],
    summary: 'Sair',
    responses: {
        204: { description: 'Sessão encerrada' },
        401: {
            description: 'Sessão ausente ou inválida',
            content: { 'application/json': { schema: errorResponseSchema } },
        },
    },
});

export const logoutController = async (req: Request, res: Response) => {
    res.clearCookie('confirma_session', {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    });

    return res.status(204).send();
};
