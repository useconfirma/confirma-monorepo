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
      content: { 'application/json': { schema: getCurrentUserResponseSchema } },
    },
    401: {
      description: 'Sessão ausente ou inválida',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
});

export const getCurrentUserController = async (req: Request, res: Response) => {
  void req.userId;
  // const useCase = new GetCurrentUserUseCase(/* dependência mockada */);
  // const result = await useCase.execute({ userId: req.userId! });

  const response: GetCurrentUserResponseDto = {
    user: { id: 'user_mock', email: 'dev@example.com' },
  };
  return res.status(200).json(response);
};
