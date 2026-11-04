import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GenerateApiKeyUseCase } from './generate-api-key.usecase.js';
import type { ApiKeyProvider } from '../../domain/providers/api-key.provider.js';
import type { SecretProtector } from '../../domain/providers/secret-protector.js';
import type { AccountRepository } from '../../domain/repositories/account.repository.js';

describe('GenerateApiKeyUseCase unit tests', () => {
  const accountRepository = {
    findSummaryByUserId: vi.fn(),
    updateSendWindow: vi.fn(),
    replaceApiKey: vi.fn(),
    updateWebhook: vi.fn(),
    updateZApi: vi.fn(),
  } satisfies AccountRepository;
  const apiKeyProvider = { generate: vi.fn() } satisfies ApiKeyProvider;
  const secretProtector = { protect: vi.fn() } satisfies SecretProtector;
  let sut: GenerateApiKeyUseCase;

  beforeEach(() => {
    vi.resetAllMocks();
    sut = new GenerateApiKeyUseCase(accountRepository, apiKeyProvider, secretProtector);
  });

  it('should replace the account API key and return the secret once', async () => {
    const createdAt = new Date('2026-11-04T12:00:00.000Z');
    vi.mocked(apiKeyProvider.generate).mockReturnValue('api-key-secret');
    vi.mocked(secretProtector.protect).mockReturnValue('api-key-hash');
    vi.mocked(accountRepository.replaceApiKey).mockResolvedValue({ createdAt });

    await expect(sut.execute({ userId: 'user-1' })).resolves.toEqual({
      apiKey: 'api-key-secret',
      createdAt,
    });
    expect(accountRepository.replaceApiKey).toHaveBeenCalledWith({
      userId: 'user-1',
      apiKeyHash: 'api-key-hash',
      createdAt: expect.any(Date),
    });
  });

  it('should propagate persistence failures without exposing a partial result', async () => {
    vi.mocked(apiKeyProvider.generate).mockReturnValue('api-key-secret');
    vi.mocked(secretProtector.protect).mockReturnValue('api-key-hash');
    vi.mocked(accountRepository.replaceApiKey).mockRejectedValue(new Error('database unavailable'));

    await expect(sut.execute({ userId: 'user-1' })).rejects.toThrow('database unavailable');
  });
});
