import type { Request, Response } from 'express';
import { openApiRegistry } from '../../../../../shared/infrastructure/http/docs/openapi.js';
import { errorResponseSchema } from '../../../../../shared/infrastructure/schemas/zod/error.schema.js';
import { validateData } from '../../../../../shared/infrastructure/validation/zod/data-validation.js';
import {
  generateApiKeyRequestSchema,
  generateApiKeyResponseSchema,
} from '../../schemas/zod/generate-api-key.schema.js';

openApiRegistry.registerPath({
  method: 'post',
  path: '/integration/api-key',
  tags: ['Accounts'],
  summary: 'Gerar API Key',
  responses: {
    201: {
      description: 'API Key gerada',
      content: { 'application/json': { schema: generateApiKeyResponseSchema } },
    },
    401: {
      description: 'Sessão ausente ou inválida',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
});

export const generateApiKeyController = async (req: Request, res: Response) => {
  const cookies = validateData(req.cookies, generateApiKeyRequestSchema);
  // const useCase = new GenerateApiKeyUseCase(/* dependências injetadas */);
  // const result = await useCase.execute({ userId: cookies.confirma_session });
  void cookies;

  return res.status(201).json({
    apiKey: 'api_key_mock',
    createdAt: new Date().toISOString(),
  });
};
