import type { Request, Response } from 'express';
import { openApiRegistry } from '../../../../../shared/infrastructure/http/docs/openapi.js';
import { errorResponseSchema } from '../../../../../shared/infrastructure/schemas/zod/error.schema.js';
import { validateData } from '../../../../../shared/infrastructure/validation/zod/data-validation.js';
import {
  requestInvitationRequestSchema,
  requestInvitationResponseSchema,
} from '../../schemas/zod/request-invitation.schema.js';

type RequestInvitationResponseDto = {
  accepted: boolean;
};

openApiRegistry.registerPath({
  method: 'post',
  path: '/invitations',
  tags: ['Auth'],
  summary: 'Solicitar convite',
  request: {
    body: {
      content: { 'application/json': { schema: requestInvitationRequestSchema } },
    },
  },
  responses: {
    202: {
      description: 'Convite aceito',
      content: { 'application/json': { schema: requestInvitationResponseSchema } },
    },
    400: {
      description: 'Corpo inválido',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
});

export const requestInvitationController = async (req: Request, res: Response) => {
  const body = validateData(req.body, requestInvitationRequestSchema);

  // const useCase = new RequestInvitationUseCase(/* dependências mockadas */);
  // const result = await useCase.execute({ email: body.email });
  void body;

  const response: RequestInvitationResponseDto = { accepted: true };
  return res.status(202).json(response);
};
