import type { Request, Response } from 'express';
import { openApiRegistry } from '../../../../../shared/infrastructure/http/docs/openapi.js';
import { errorResponseSchema } from '../../../../../shared/infrastructure/schemas/zod/error.schema.js';
import { validateData } from '../../../../../shared/infrastructure/validation/zod/data-validation.js';
import {
  getAccountRequestSchema,
  getAccountResponseSchema,
} from '../../schemas/zod/get-account.schema.js';

type AccountConfigurationDto = {
  configured: boolean;
  start: string | null;
  end: string | null;
  timeZone: string | null;
  updatedAt: string | null;
};

type GetAccountResponseDto = {
  account: {
    id: string;
    name: string;
    sendWindow: AccountConfigurationDto;
    apiKey: { configured: boolean; createdAt: string | null };
    webhook: { configured: boolean; url: string | null; updatedAt: string | null };
    zApi: { configured: boolean; instanceId: string | null; updatedAt: string | null };
  };
};

openApiRegistry.registerPath({
  method: 'get',
  path: '/v1/account',
  tags: ['Auth'],
  summary: 'Consultar account',
  responses: {
    200: {
      description: 'Account consultada',
      content: { 'application/json': { schema: getAccountResponseSchema } },
    },
    401: {
      description: 'Sessão ausente ou inválida',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
});

export const getAccountController = async (req: Request, res: Response) => {
  const cookies = validateData(req.cookies, getAccountRequestSchema);

  // const useCase = new GetAccountUseCase();
  // const result = await useCase.execute({ userId: cookies.confirma_session });
  void cookies;

  const response: GetAccountResponseDto = {
    account: {
      id: 'account_mock',
      name: 'Account de teste',
      sendWindow: {
        configured: false,
        start: null,
        end: null,
        timeZone: null,
        updatedAt: null,
      },
      apiKey: { configured: false, createdAt: null },
      webhook: { configured: false, url: null, updatedAt: null },
      zApi: { configured: false, instanceId: null, updatedAt: null },
    },
  };
  return res.status(200).json(response);
};
