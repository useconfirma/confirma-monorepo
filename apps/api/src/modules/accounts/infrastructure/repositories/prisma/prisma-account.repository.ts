import { prisma } from '../../../../../shared/infrastructure/database/prisma/index.js';
import type { AccountSummary } from '../../../domain/models/account.model.js';
import type { AccountRepository } from '../../../domain/repositories/account.repository.js';

export class PrismaAccountRepository implements AccountRepository {
    async findSummaryByUserId(userId: string): Promise<AccountSummary | null> {
        const account = await prisma.account.findUnique({
            where: { userId },
            include: {
                integrationConfig: true,
                apiKeys: {
                    where: { revokedAt: null },
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
        });

        if (!account) {
            return null;
        }

        const integrationConfig = account.integrationConfig;
        const apiKey = account.apiKeys[0] ?? null;

        return {
            id: account.id,
            name: account.name,
            sendWindow: {
                configured:
                    integrationConfig?.sendWindowStart != null &&
                    integrationConfig.sendWindowEnd != null &&
                    integrationConfig.timeZone != null,
                start: this.formatTime(integrationConfig?.sendWindowStart),
                end: this.formatTime(integrationConfig?.sendWindowEnd),
                timeZone: integrationConfig?.timeZone ?? null,
                updatedAt: integrationConfig?.updatedAt ?? null,
            },
            apiKey: {
                configured: apiKey !== null,
                createdAt: apiKey?.createdAt ?? null,
            },
            webhook: {
                configured: integrationConfig?.webhookUrl != null,
                url: integrationConfig?.webhookUrl ?? null,
                updatedAt: integrationConfig?.updatedAt ?? null,
            },
            zApi: {
                configured:
                    integrationConfig?.zApiInstanceId != null &&
                    integrationConfig.zApiInstanceTokenEncrypted != null &&
                    integrationConfig.zApiClientTokenEncrypted != null,
                instanceId: integrationConfig?.zApiInstanceId ?? null,
                updatedAt: integrationConfig?.updatedAt ?? null,
            },
        };
    }

    private formatTime(value: Date | null | undefined): string | null {
        return value ? value.toISOString().slice(11, 16) : null;
    }
}
