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

        const sendWindowConfigured =
            integrationConfig?.sendWindowStart != null &&
            integrationConfig.sendWindowEnd != null &&
            integrationConfig.timeZone != null;
        const webhookConfigured = integrationConfig?.webhookUrl != null;
        const zApiConfigured =
            integrationConfig?.zApiInstanceId != null &&
            integrationConfig.zApiInstanceTokenEncrypted != null &&
            integrationConfig.zApiClientTokenEncrypted != null;

        // A configuração é uma linha só: `updatedAt` vale para o bloco apenas
        // quando ele está configurado; caso contrário, fica `null`.
        const updatedAtWhen = (configured: boolean) =>
            configured ? (integrationConfig?.updatedAt ?? null) : null;

        return {
            id: account.id,
            name: account.name,
            sendWindow: {
                configured: sendWindowConfigured,
                start: this.formatTime(integrationConfig?.sendWindowStart),
                end: this.formatTime(integrationConfig?.sendWindowEnd),
                timeZone: integrationConfig?.timeZone ?? null,
                updatedAt: updatedAtWhen(sendWindowConfigured),
            },
            apiKey: {
                configured: apiKey !== null,
                createdAt: apiKey?.createdAt ?? null,
            },
            webhook: {
                configured: webhookConfigured,
                url: integrationConfig?.webhookUrl ?? null,
                updatedAt: updatedAtWhen(webhookConfigured),
            },
            zApi: {
                configured: zApiConfigured,
                instanceId: integrationConfig?.zApiInstanceId ?? null,
                updatedAt: updatedAtWhen(zApiConfigured),
            },
        };
    }

    private formatTime(value: Date | null | undefined): string | null {
        return value ? value.toISOString().slice(11, 16) : null;
    }
}
