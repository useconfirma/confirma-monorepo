import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GetAccountUseCase } from './get-account.usecase.js';
import type { AccountSummary } from '../../domain/models/account.model.js';
import type { AccountRepository } from '../../domain/repositories/account.repository.js';

describe('GetAccountUseCase unit tests', () => {
    const account: AccountSummary = {
        id: 'account-1',
        name: 'Test Account',
        sendWindow: {
            configured: false,
            start: null,
            end: null,
            timeZone: null,
            updatedAt: null,
        },
        apiKey: { configured: false, createdAt: null },
        webhook: { configured: false, url: null, updatedAt: null },
        zApi: { configured: false, instanceId: null, updatedAt: null },
    };
    const accountRepository = {
        findSummaryByUserId: vi.fn(),
    } satisfies AccountRepository;
    let sut: GetAccountUseCase;

    beforeEach(() => {
        vi.resetAllMocks();
        sut = new GetAccountUseCase(accountRepository);
    });

    it('should return the authenticated user account summary', async () => {
        vi.mocked(accountRepository.findSummaryByUserId).mockResolvedValue(
            account,
        );

        await expect(sut.execute({ userId: 'user-1' })).resolves.toEqual(
            account,
        );
        expect(accountRepository.findSummaryByUserId).toHaveBeenCalledWith(
            'user-1',
        );
    });

    it('should reject an unavailable account', async () => {
        vi.mocked(accountRepository.findSummaryByUserId).mockResolvedValue(
            null,
        );

        await expect(
            sut.execute({ userId: 'missing-user' }),
        ).rejects.toMatchObject({
            code: 'UNAUTHENTICATED',
            statusCode: 401,
        });
    });
});
