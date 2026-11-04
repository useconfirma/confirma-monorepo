import type { Request, Response } from 'express';
import { openApiRegistry } from '../../../../../shared/infrastructure/http/docs/openapi.js';
import { errorResponseSchema } from '../../../../../shared/infrastructure/schemas/zod/error.schema.js';
import { validateData } from '../../../../../shared/infrastructure/validation/zod/data-validation.js';
import { logoutRequestSchema } from '../../schemas/zod/logout.schema.js';

type LogoutResponseDto = Record<string, never>;

openApiRegistry.registerPath({
  method: 'delete',
  path: '/v1/sessions/current',
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
  const cookies = validateData(req.cookies, logoutRequestSchema);

  // const useCase = new LogoutUseCase();
  // await useCase.execute({ sessionToken: cookies.confirma_session });
  void cookies;

  const response: LogoutResponseDto = {};
  return res.status(204).json(response);
};
