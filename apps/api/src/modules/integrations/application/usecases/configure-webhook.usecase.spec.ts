import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConfigureWebhookUseCase } from './configure-webhook.usecase.js';
import type { WebhookConfiguration } from '../../../accounts/domain/models/account.model.js';
import type { SecretProtector } from '../../domain/providers/secret-protector.js';
import type { IntegrationRepository } from '../../domain/repositories/integration.repository.js';

describe('ConfigureWebhookUseCase unit tests', () => {
    const webhook: WebhookConfiguration = {
        configured: true,
        url: 'https://example.com/confirma',
        updatedAt: new Date('2026-11-04T12:00:00.000Z'),
    };
    const accountRepository = {
        updateSendWindow: vi.fn(),
        replaceApiKey: vi.fn(),
        updateWebhook: vi.fn(),
        updateZApi: vi.fn(),
    } satisfies IntegrationRepository;
    const secretProtector = { protect: vi.fn() } satisfies SecretProtector;
    let sut: ConfigureWebhookUseCase;

    beforeEach(() => {
        vi.resetAllMocks();
        sut = new ConfigureWebhookUseCase(accountRepository, secretProtector);
    });

    it('should persist an HTTPS webhook without storing its secret in plain text', async () => {
        vi.mocked(secretProtector.protect).mockReturnValue('secret-hash');
        vi.mocked(accountRepository.updateWebhook).mockResolvedValue(webhook);

        await expect(
            sut.execute({
                userId: 'user-1',
                url: webhook.url!,
                secret: 'webhook-secret',
            }),
        ).resolves.toEqual(webhook);
        expect(secretProtector.protect).toHaveBeenCalledWith('webhook-secret');
        expect(accountRepository.updateWebhook).toHaveBeenCalledWith({
            userId: 'user-1',
            url: webhook.url,
            secretHash: 'secret-hash',
            updatedAt: expect.any(Date),
        });
    });

    it.each(['http://example.com/confirma', 'not-a-url'])(
        'should reject a non-HTTPS webhook without updating the account',
        async (url) => {
            await expect(
                sut.execute({
                    userId: 'user-1',
                    url,
                    secret: 'webhook-secret',
                }),
            ).rejects.toMatchObject({
                code: 'INVALID_WEBHOOK',
                statusCode: 422,
            });
            expect(accountRepository.updateWebhook).not.toHaveBeenCalled();
        },
    );
});
