import type { Request, Response } from 'express';
import { openApiRegistry } from '../../../../../shared/infrastructure/http/docs/openapi.js';
import { errorResponseSchema } from '../../../../../shared/infrastructure/schemas/zod/error.schema.js';
import { validateData } from '../../../../../shared/infrastructure/validation/zod/data-validation.js';
import { loginRequestSchema } from '../../schemas/zod/login.schema.js';

type LoginResponseDto = Record<string, never>;

openApiRegistry.registerPath({
    method: 'post',
    path: '/sessions',
    tags: ['Auth'],
    summary: 'Entrar',
    request: {
        body: {
            content: { 'application/json': { schema: loginRequestSchema } },
        },
    },
    responses: {
        204: { description: 'Sessão criada' },
        401: {
            description: 'Credenciais inválidas',
            content: { 'application/json': { schema: errorResponseSchema } },
        },
    },
});

export const loginController = async (req: Request, res: Response) => {
    const body = validateData(req.body, loginRequestSchema);

    // const useCase = new LoginUseCase(/* dependência mockada */);
    // const result = await useCase.execute(body);
    void body;

    const response: LoginResponseDto = {};
    return res.status(204).json(response);
};
