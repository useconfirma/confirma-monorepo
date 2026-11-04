import type { Request, Response } from 'express';
import { openApiRegistry } from '../../../../../shared/infrastructure/http/docs/openapi.js';
import { errorResponseSchema } from '../../../../../shared/infrastructure/schemas/zod/error.schema.js';
import { validateData } from '../../../../../shared/infrastructure/validation/zod/data-validation.js';
import {
  acceptInvitationRequestSchema,
  acceptInvitationResponseSchema,
} from '../../schemas/zod/accept-invitation.schema.js';

type AcceptInvitationResponseDto = {
  user: { id: string; email: string };
  account: { id: string; name: string };
};

openApiRegistry.registerPath({
  method: 'post',
  path: '/v1/accounts',
  tags: ['Auth'],
  summary: 'Aceitar convite e criar account',
  request: {
    body: { content: { 'application/json': { schema: acceptInvitationRequestSchema } } },
  },
  responses: {
    201: {
      description: 'Account criada',
      content: { 'application/json': { schema: acceptInvitationResponseSchema } },
    },
    409: {
      description: 'E-mail já cadastrado',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
    410: {
      description: 'Convite indisponível',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
    422: {
      description: 'Dados inválidos',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
});

export const acceptInvitationController = async (req: Request, res: Response) => {
  const body = validateData(req.body, acceptInvitationRequestSchema);

  // const useCase = new AcceptInvitationUseCase(/* dependências mockadas */);
  // const result = await useCase.execute(body);
  void body;

  const response: AcceptInvitationResponseDto = {
    user: { id: 'user_mock', email: 'dev@example.com' },
    account: { id: 'account_mock', name: 'Account de teste' },
  };
  return res.status(201).json(response);
};
