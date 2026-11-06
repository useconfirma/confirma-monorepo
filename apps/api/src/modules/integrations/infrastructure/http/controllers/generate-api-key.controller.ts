import type { Request, Response } from 'express';
import { GenerateApiKeyUseCase } from '../../../application/usecases/generate-api-key.usecase.js';
import { PrismaIntegrationRepository } from '../../repositories/prisma/prisma-integration.repository.js';
import { RandomApiKeyProvider } from '../../../../../shared/infrastructure/providers/random-api-key.provider.js';
import { Sha256SecretProtector } from '../../../../../shared/infrastructure/providers/sha256-secret-protector.js';
import { openApiRegistry } from '../../../../../shared/infrastructure/http/docs/openapi.js';
import { errorResponseSchema } from '../../../../../shared/infrastructure/schemas/zod/error.schema.js';
import { generateApiKeyResponseSchema } from '../../schemas/zod/generate-api-key.schema.js';

type GenerateApiKeyResponseDto = {
    apiKey: string;
    createdAt: string;
};

const generateApiKey = new GenerateApiKeyUseCase(
    new PrismaIntegrationRepository(),
    new RandomApiKeyProvider(),
    new Sha256SecretProtector(),
);

openApiRegistry.registerPath({
    method: 'post',
    path: '/integration/api-key',
    tags: ['Integrations'],
    summary: 'Gerar API Key',
    responses: {
        201: {
            description: 'API Key gerada',
            content: {
                'application/json': { schema: generateApiKeyResponseSchema },
            },
        },
        401: {
            description: 'Sessão ausente ou inválida',
            content: { 'application/json': { schema: errorResponseSchema } },
        },
    },
});

export const generateApiKeyController = async (req: Request, res: Response) => {
    const result = await generateApiKey.execute({ userId: req.userId! });
    const response: GenerateApiKeyResponseDto = {
        apiKey: result.apiKey,
        createdAt: result.createdAt.toISOString(),
    };

    return res.status(201).json(response);
};
