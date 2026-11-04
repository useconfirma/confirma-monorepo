import type { Request, Response } from 'express';
import { openApiRegistry } from '../../../../../shared/infrastructure/http/docs/openapi.js';
import { errorResponseSchema } from '../../../../../shared/infrastructure/schemas/zod/error.schema.js';
import { validateData } from '../../../../../shared/infrastructure/validation/zod/data-validation.js';
import {
  verifyInvitationRequestSchema,
  verifyInvitationResponseSchema,
} from '../../schemas/zod/verify-invitation.schema.js';

type VerifyInvitationResponseDto = {
  email: string;
};

openApiRegistry.registerPath({
  method: 'get',
  path: '/v1/invitations/{invitationToken}',
  tags: ['Auth'],
  summary: 'Verificar convite',
  request: { params: verifyInvitationRequestSchema },
  responses: {
    200: {
      description: 'Convite disponível',
      content: { 'application/json': { schema: verifyInvitationResponseSchema } },
    },
    410: {
      description: 'Convite indisponível',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
});

export const verifyInvitationController = async (req: Request, res: Response) => {
  const params = validateData(req.params, verifyInvitationRequestSchema);

  // const useCase = new VerifyInvitationUseCase(/* dependência mockada */);
  // const result = await useCase.execute({ invitationToken: params.invitationToken });
  void params;

  const response: VerifyInvitationResponseDto = { email: 'dev@example.com' };
  return res.status(200).json(response);
};
