import type { Request, Response } from 'express';
import { openApiRegistry } from '../../../../../shared/infrastructure/http/docs/openapi.js';
import { errorResponseSchema } from '../../../../../shared/infrastructure/schemas/zod/error.schema.js';

type LogoutResponseDto = Record<string, never>;

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
    void req.userId;
    // const useCase = new LogoutUseCase();
    // await useCase.execute(/* sessão já validada pelo middleware */);

    const response: LogoutResponseDto = {};
    return res.status(204).json(response);
};
