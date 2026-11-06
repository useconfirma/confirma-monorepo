import type { Request, Response } from 'express';
import { openApiRegistry } from '../../../../../shared/infrastructure/http/docs/openapi.js';
import { errorResponseSchema } from '../../../../../shared/infrastructure/schemas/zod/error.schema.js';
import { getCurrentUserResponseSchema } from '../../schemas/zod/get-current-user.schema.js';

type GetCurrentUserResponseDto = {
    user: { id: string; email: string };
};

openApiRegistry.registerPath({
    method: 'get',
    path: '/users/me',
    tags: ['Auth'],
    summary: 'Consultar usuário atual',
    responses: {
        200: {
            description: 'Usuário consultado',
            content: {
                'application/json': { schema: getCurrentUserResponseSchema },
            },
        },
        401: {
            description: 'Sessão ausente ou inválida',
            content: { 'application/json': { schema: errorResponseSchema } },
        },
    },
});
import { GetCurrentUserUseCase } from '../../../application/usecases/get-current-user.usecase.js';
import { PrismaUserRepository } from '../../repositories/prisma/prisma-user.repository.js';

const getCurrentUser = new GetCurrentUserUseCase(new PrismaUserRepository());

export const getCurrentUserController = async (req: Request, res: Response) => {
    const result = await getCurrentUser.execute({
        userId: req.userId!,
    });
    const response: GetCurrentUserResponseDto = {
        user: { id: result.id, email: result.email },
    };

    return res.status(200).json(response);
};
