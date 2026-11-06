import type { Request, Response } from 'express';
import { ConfigureWebhookUseCase } from '../../../application/usecases/configure-webhook.usecase.js';
import { PrismaIntegrationRepository } from '../../repositories/prisma/prisma-integration.repository.js';
import { Sha256SecretProtector } from '../../../../../shared/infrastructure/providers/sha256-secret-protector.js';
import { openApiRegistry } from '../../../../../shared/infrastructure/http/docs/openapi.js';
import { errorResponseSchema } from '../../../../../shared/infrastructure/schemas/zod/error.schema.js';
import { validateData } from '../../../../../shared/infrastructure/validation/zod/data-validation.js';
import {
    configureWebhookBodySchema,
    configureWebhookResponseSchema,
} from '../../schemas/zod/configure-webhook.schema.js';

type ConfigureWebhookResponseDto = {
    configured: boolean;
    url: string;
    updatedAt: string;
};

const configureWebhook = new ConfigureWebhookUseCase(
    new PrismaIntegrationRepository(),
    new Sha256SecretProtector(),
);

openApiRegistry.registerPath({
    method: 'put',
    path: '/integration/webhook',
    tags: ['Integrations'],
    summary: 'Configurar webhook',
    request: {
        body: {
            content: {
                'application/json': { schema: configureWebhookBodySchema },
            },
        },
    },
    responses: {
        200: {
            description: 'Webhook configurado',
            content: {
                'application/json': {
                    schema: configureWebhookResponseSchema,
                },
            },
        },
        422: {
            description: 'URL ou segredo inválido',
            content: { 'application/json': { schema: errorResponseSchema } },
        },
    },
});

export const configureWebhookController = async (
    req: Request,
    res: Response,
) => {
    const body = validateData(req.body, configureWebhookBodySchema);
    const result = await configureWebhook.execute({
        ...body,
        userId: req.userId!,
    });
    const response: ConfigureWebhookResponseDto = {
        configured: result.configured,
        url: result.url!,
        updatedAt: result.updatedAt!.toISOString(),
    };

    return res.status(200).json(response);
};
