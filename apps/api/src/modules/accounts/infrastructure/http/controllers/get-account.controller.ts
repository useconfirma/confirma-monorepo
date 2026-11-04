import type { Request, Response } from 'express';
import { openApiRegistry } from '../../../../../shared/infrastructure/http/docs/openapi.js';
import { errorResponseSchema } from '../../../../../shared/infrastructure/schemas/zod/error.schema.js';
import { getAccountResponseSchema } from '../../schemas/zod/get-account.schema.js';

type GetAccountResponseDto = {
  account: {
    id: string;
    name: string;
    sendWindow: {
      configured: boolean;
      start: string | null;
      end: string | null;
      timeZone: string | null;
      updatedAt: string | null;
    };
    apiKey: { configured: boolean; createdAt: string | null };
    webhook: { configured: boolean; url: string | null; updatedAt: string | null };
    zApi: { configured: boolean; instanceId: string | null; updatedAt: string | null };
  };
};

openApiRegistry.registerPath({
  method: 'get',
  path: '/account',
  tags: ['Accounts'],
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
  void req.userId;
  void req.accountId;
  // const useCase = new GetAccountUseCase(/* dependências injetadas */);
  // const result = await useCase.execute({ userId: req.userId! });

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
