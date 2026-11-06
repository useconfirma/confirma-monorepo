import type { Request, Response } from 'express';
import { ConfigureZApiUseCase } from '../../../application/usecases/configure-z-api.usecase.js';
import { PrismaIntegrationRepository } from '../../repositories/prisma/prisma-integration.repository.js';
import { HttpZApiProvider } from '../../../../../shared/infrastructure/providers/http-z-api.provider.js';
import { Sha256SecretProtector } from '../../../../../shared/infrastructure/providers/sha256-secret-protector.js';
import { env } from '../../../../../shared/infrastructure/env/index.js';
import { openApiRegistry } from '../../../../../shared/infrastructure/http/docs/openapi.js';
import { errorResponseSchema } from '../../../../../shared/infrastructure/schemas/zod/error.schema.js';
import { validateData } from '../../../../../shared/infrastructure/validation/zod/data-validation.js';
import {
    configureZApiBodySchema,
    configureZApiResponseSchema,
} from '../../schemas/zod/configure-z-api.schema.js';

type ConfigureZApiResponseDto = {
    configured: boolean;
    instanceId: string;
    updatedAt: string;
};

const configureZApi = new ConfigureZApiUseCase(
    new PrismaIntegrationRepository(),
    new Sha256SecretProtector(),
    new HttpZApiProvider(),
    env.PUBLIC_APP_URL,
);

openApiRegistry.registerPath({
    method: 'put',
    path: '/integration/z-api',
    tags: ['Integrations'],
    summary: 'Configurar Z-API',
    request: {
        body: {
            content: {
                'application/json': { schema: configureZApiBodySchema },
            },
        },
    },
    responses: {
        200: {
            description: 'Z-API configurada',
            content: {
                'application/json': {
                    schema: configureZApiResponseSchema,
                },
            },
        },
        422: {
            description: 'Credenciais rejeitadas ou callback não configurado',
            content: { 'application/json': { schema: errorResponseSchema } },
        },
    },
});

export const configureZApiController = async (req: Request, res: Response) => {
    const body = validateData(req.body, configureZApiBodySchema);
    const result = await configureZApi.execute({
        ...body,
        userId: req.userId!,
    });
    const response: ConfigureZApiResponseDto = {
        configured: result.configured,
        instanceId: result.instanceId!,
        updatedAt: result.updatedAt!.toISOString(),
    };

    return res.status(200).json(response);
};
