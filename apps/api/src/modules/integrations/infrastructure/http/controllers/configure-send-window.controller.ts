import type { Request, Response } from 'express';
import { ConfigureSendWindowUseCase } from '../../../application/usecases/configure-send-window.usecase.js';
import { PrismaIntegrationRepository } from '../../repositories/prisma/prisma-integration.repository.js';
import { openApiRegistry } from '../../../../../shared/infrastructure/http/docs/openapi.js';
import { errorResponseSchema } from '../../../../../shared/infrastructure/schemas/zod/error.schema.js';
import { validateData } from '../../../../../shared/infrastructure/validation/zod/data-validation.js';
import {
    configureSendWindowBodySchema,
    configureSendWindowResponseSchema,
} from '../../schemas/zod/configure-send-window.schema.js';

type ConfigureSendWindowResponseDto = {
    configured: boolean;
    start: string;
    end: string;
    timeZone: string;
    updatedAt: string;
};

const configureSendWindow = new ConfigureSendWindowUseCase(
    new PrismaIntegrationRepository(),
);

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
    const result = await configureSendWindow.execute({
        ...body,
        userId: req.userId!,
    });
    const response: ConfigureSendWindowResponseDto = {
        configured: result.configured,
        start: result.start!,
        end: result.end!,
        timeZone: result.timeZone!,
        updatedAt: result.updatedAt!.toISOString(),
    };

    return res.status(200).json(response);
};
