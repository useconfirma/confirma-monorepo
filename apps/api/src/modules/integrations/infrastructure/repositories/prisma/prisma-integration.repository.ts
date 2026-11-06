import { AppError } from '../../../../../shared/domain/errors/app-error.js';
import { prisma } from '../../../../../shared/infrastructure/database/prisma/index.js';
import type {
    SendWindow,
    WebhookConfiguration,
    ZApiConfiguration,
} from '../../../../accounts/domain/models/account.model.js';
import type {
    IntegrationRepository,
    ReplaceApiKeyInput,
    UpdateSendWindowInput,
    UpdateWebhookInput,
    UpdateZApiInput,
} from '../../../domain/repositories/integration.repository.js';

export class PrismaIntegrationRepository implements IntegrationRepository {
    async updateSendWindow(input: UpdateSendWindowInput): Promise<SendWindow> {
        const accountId = await this.findAccountId(input.userId);
        const integrationConfig = await prisma.integrationConfig.upsert({
            where: { accountId },
            create: {
                accountId,
                sendWindowStart: this.parseTime(input.start),
                sendWindowEnd: this.parseTime(input.end),
                timeZone: input.timeZone,
            },
            update: {
                sendWindowStart: this.parseTime(input.start),
                sendWindowEnd: this.parseTime(input.end),
                timeZone: input.timeZone,
            },
        });

        return {
            configured: true,
            start: input.start,
            end: input.end,
            timeZone: input.timeZone,
            updatedAt: integrationConfig.updatedAt,
        };
    }

    async replaceApiKey(
        input: ReplaceApiKeyInput,
    ): Promise<{ createdAt: Date }> {
        const accountId = await this.findAccountId(input.userId);

        return prisma.$transaction(async (transaction) => {
            await transaction.apiKey.updateMany({
                where: { accountId, revokedAt: null },
                data: { revokedAt: input.createdAt },
            });

            const apiKey = await transaction.apiKey.create({
                data: {
                    accountId,
                    keyHash: input.apiKeyHash,
                    keyPrefix: input.apiKeyHash.slice(0, 8),
                    createdAt: input.createdAt,
                },
            });

            return { createdAt: apiKey.createdAt };
        });
    }

    async updateWebhook(
        input: UpdateWebhookInput,
    ): Promise<WebhookConfiguration> {
        const accountId = await this.findAccountId(input.userId);
        const integrationConfig = await prisma.integrationConfig.upsert({
            where: { accountId },
            create: {
                accountId,
                webhookUrl: input.url,
                webhookSecretEncrypted: input.secretHash,
            },
            update: {
                webhookUrl: input.url,
                webhookSecretEncrypted: input.secretHash,
            },
        });

        return {
            configured: true,
            url: integrationConfig.webhookUrl,
            updatedAt: integrationConfig.updatedAt,
        };
    }

    async updateZApi(input: UpdateZApiInput): Promise<ZApiConfiguration> {
        const accountId = await this.findAccountId(input.userId);
        const integrationConfig = await prisma.integrationConfig.upsert({
            where: { accountId },
            create: {
                accountId,
                zApiInstanceId: input.instanceId,
                zApiInstanceTokenEncrypted: input.instanceToken,
                zApiClientTokenEncrypted: input.clientToken,
                callbackTokenHash: input.callbackTokenHash,
            },
            update: {
                zApiInstanceId: input.instanceId,
                zApiInstanceTokenEncrypted: input.instanceToken,
                zApiClientTokenEncrypted: input.clientToken,
                callbackTokenHash: input.callbackTokenHash,
            },
        });

        return {
            configured: true,
            instanceId: integrationConfig.zApiInstanceId,
            updatedAt: integrationConfig.updatedAt,
        };
    }

    private async findAccountId(userId: string): Promise<string> {
        const account = await prisma.account.findUnique({
            where: { userId },
            select: { id: true },
        });

        if (!account) {
            throw new AppError(
                'ACCOUNT_NOT_FOUND',
                'Account não encontrada.',
                404,
            );
        }

        return account.id;
    }

    private parseTime(value: string): Date {
        const [hours, minutes] = value.split(':').map(Number);
        return new Date(Date.UTC(1970, 0, 1, hours, minutes));
    }
}
