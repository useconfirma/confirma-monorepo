import type { Request, Response } from 'express';
import { openApiRegistry } from '../../../../../shared/infrastructure/http/docs/openapi.js';
import { errorResponseSchema } from '../../../../../shared/infrastructure/schemas/zod/error.schema.js';
import { validateData } from '../../../../../shared/infrastructure/validation/zod/data-validation.js';
import {
  configureZApiBodySchema,
  configureZApiResponseSchema,
} from '../../schemas/zod/configure-z-api.schema.js';

openApiRegistry.registerPath({
  method: 'put',
  path: '/integration/z-api',
  tags: ['Integrations'],
  summary: 'Configurar Z-API',
  request: { body: { content: { 'application/json': { schema: configureZApiBodySchema } } } },
  responses: {
    200: {
      description: 'Z-API configurada',
      content: { 'application/json': { schema: configureZApiResponseSchema } },
    },
    422: {
      description: 'Credenciais rejeitadas ou callback não configurado',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
});

export const configureZApiController = async (req: Request, res: Response) => {
  const body = validateData(req.body, configureZApiBodySchema);
  void req.userId;
  void req.accountId;
  // const useCase = new ConfigureZApiUseCase(/* dependências injetadas */);
  // const result = await useCase.execute({ ...body, userId: req.userId! });
  void body;

  return res.status(200).json({
    configured: false,
    instanceId: null,
    updatedAt: null,
  });
};
