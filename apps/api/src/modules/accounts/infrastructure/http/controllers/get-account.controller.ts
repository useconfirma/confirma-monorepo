import type { Request, Response } from 'express';
import { GetAccountUseCase } from '../../../application/usecases/get-account.usecase.js';
import { PrismaAccountRepository } from '../../repositories/prisma/prisma-account.repository.js';
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
        webhook: {
            configured: boolean;
            url: string | null;
            updatedAt: string | null;
        };
        zApi: {
            configured: boolean;
            instanceId: string | null;
            updatedAt: string | null;
        };
    };
};

const getAccount = new GetAccountUseCase(new PrismaAccountRepository());

openApiRegistry.registerPath({
    method: 'get',
    path: '/account',
    tags: ['Accounts'],
    summary: 'Consultar account',
    responses: {
        200: {
            description: 'Account consultada',
            content: {
                'application/json': { schema: getAccountResponseSchema },
            },
        },
        401: {
            description: 'Sessão ausente ou inválida',
            content: { 'application/json': { schema: errorResponseSchema } },
        },
        403: {
            description: 'Acesso à account não autorizado',
            content: { 'application/json': { schema: errorResponseSchema } },
        },
    },
});

export const getAccountController = async (req: Request, res: Response) => {
    const result = await getAccount.execute({ userId: req.userId! });
    const response: GetAccountResponseDto = {
        account: {
            id: result.id,
            name: result.name,
            sendWindow: {
                configured: result.sendWindow.configured,
                start: result.sendWindow.start,
                end: result.sendWindow.end,
                timeZone: result.sendWindow.timeZone,
                updatedAt: result.sendWindow.updatedAt?.toISOString() ?? null,
            },
            apiKey: {
                configured: result.apiKey.configured,
                createdAt: result.apiKey.createdAt?.toISOString() ?? null,
            },
            webhook: {
                configured: result.webhook.configured,
                url: result.webhook.url,
                updatedAt: result.webhook.updatedAt?.toISOString() ?? null,
            },
            zApi: {
                configured: result.zApi.configured,
                instanceId: result.zApi.instanceId,
                updatedAt: result.zApi.updatedAt?.toISOString() ?? null,
            },
        },
    };

    return res.status(200).json(response);
};
