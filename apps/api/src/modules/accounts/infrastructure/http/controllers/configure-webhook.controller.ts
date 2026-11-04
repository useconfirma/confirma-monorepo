import type { Request, Response } from 'express';
import { openApiRegistry } from '../../../../../shared/infrastructure/http/docs/openapi.js';
import { errorResponseSchema } from '../../../../../shared/infrastructure/schemas/zod/error.schema.js';
import { validateData } from '../../../../../shared/infrastructure/validation/zod/data-validation.js';
import {
  configureWebhookRequestSchema,
  configureWebhookBodySchema,
  configureWebhookResponseSchema,
} from '../../schemas/zod/configure-webhook.schema.js';

openApiRegistry.registerPath({
  method: 'put',
  path: '/integration/webhook',
  tags: ['Accounts'],
  summary: 'Configurar webhook',
  request: { body: { content: { 'application/json': { schema: configureWebhookBodySchema } } } },
  responses: {
    200: {
      description: 'Webhook configurado',
      content: { 'application/json': { schema: configureWebhookResponseSchema } },
    },
    422: {
      description: 'URL ou segredo inválido',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
});

export const configureWebhookController = async (req: Request, res: Response) => {
  const cookies = validateData(req.cookies, configureWebhookRequestSchema);
  const body = validateData(req.body, configureWebhookBodySchema);
  // const useCase = new ConfigureWebhookUseCase(/* dependências injetadas */);
  // const result = await useCase.execute({ ...body, userId: cookies.confirma_session });
  void cookies;
  void body;

  return res.status(200).json({
    configured: false,
    url: null,
    updatedAt: null,
  });
};
