import type { Request, Response } from 'express';
import { openApiRegistry } from '../../../../../shared/infrastructure/http/docs/openapi.js';
import { errorResponseSchema } from '../../../../../shared/infrastructure/schemas/zod/error.schema.js';
import { validateData } from '../../../../../shared/infrastructure/validation/zod/data-validation.js';
import {
    configureSendWindowBodySchema,
    configureSendWindowResponseSchema,
} from '../../schemas/zod/configure-send-window.schema.js';

openApiRegistry.registerPath({
    method: 'put',
    path: '/integration/send-window',
    tags: ['Integrations'],
    summary: 'Configurar janela de envio',
    request: {
        body: {
            content: {
                'application/json': { schema: configureSendWindowBodySchema },
            },
        },
    },
    responses: {
        200: {
            description: 'Janela configurada',
            content: {
                'application/json': {
                    schema: configureSendWindowResponseSchema,
                },
            },
        },
        422: {
            description: 'Janela ou fuso inválido',
            content: { 'application/json': { schema: errorResponseSchema } },
        },
    },
});

export const configureSendWindowController = async (
    req: Request,
    res: Response,
) => {
    const body = validateData(req.body, configureSendWindowBodySchema);
    void req.userId;
    void req.accountId;
    // const useCase = new ConfigureSendWindowUseCase(/* dependências injetadas */);
    // const result = await useCase.execute({ ...body, userId: req.userId! });
    void body;

    return res.status(200).json({
        configured: false,
        start: null,
        end: null,
        timeZone: null,
        updatedAt: null,
    });
};
