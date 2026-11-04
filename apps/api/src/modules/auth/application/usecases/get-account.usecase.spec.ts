import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GetAccountUseCase } from './get-account.usecase.js';
import type {
  AccountRepository,
  AccountSummary,
} from '../../domain/repositories/account.repository.js';

describe('GetAccountUseCase unit tests', () => {
  const account: AccountSummary = {
    id: 'account-1',
    name: 'Test Account',
    sendWindow: { configured: false, start: null, end: null, timeZone: null, updatedAt: null },
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

  it('should return the account summary for the authenticated user', async () => {
    vi.mocked(accountRepository.findSummaryByUserId).mockResolvedValue(account);

    const result = await sut.execute({ userId: 'user-1' });

    expect(result).toEqual(account);
    expect(accountRepository.findSummaryByUserId).toHaveBeenCalledWith('user-1');
  });

  it('should reject an unknown authenticated user', async () => {
    vi.mocked(accountRepository.findSummaryByUserId).mockResolvedValue(null);

    await expect(sut.execute({ userId: 'missing-user' })).rejects.toMatchObject({
      code: 'UNAUTHENTICATED',
      statusCode: 401,
    });
  });
});
