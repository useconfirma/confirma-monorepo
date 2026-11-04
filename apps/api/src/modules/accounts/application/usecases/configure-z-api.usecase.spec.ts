import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConfigureZApiUseCase } from './configure-z-api.usecase.js';
import type { ZApiConfiguration } from '../../domain/models/account.model.js';
import type { SecretProtector } from '../../domain/providers/secret-protector.js';
import type { ZApiProvider } from '../../domain/providers/z-api.provider.js';
import type { AccountRepository } from '../../domain/repositories/account.repository.js';

describe('ConfigureZApiUseCase unit tests', () => {
  const configuration: ZApiConfiguration = {
    configured: true,
    instanceId: 'instance-id',
    updatedAt: new Date('2026-11-04T12:00:00.000Z'),
  };
  const accountRepository = {
    findSummaryByUserId: vi.fn(),
    updateSendWindow: vi.fn(),
    replaceApiKey: vi.fn(),
    updateWebhook: vi.fn(),
    updateZApi: vi.fn(),
  } satisfies AccountRepository;
  const secretProtector = { protect: vi.fn() } satisfies SecretProtector;
  const zApiProvider = { registerCallback: vi.fn() } satisfies ZApiProvider;
  let sut: ConfigureZApiUseCase;

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(secretProtector.protect).mockImplementation((value) => `protected-${value}`);
    sut = new ConfigureZApiUseCase(
      accountRepository,
      secretProtector,
      zApiProvider,
      'https://api.example.com',
    );
  });

  it('should register the callback before persisting the Z-API configuration', async () => {
    vi.mocked(zApiProvider.registerCallback).mockResolvedValue(undefined);
    vi.mocked(accountRepository.updateZApi).mockResolvedValue(configuration);

    await expect(
      sut.execute({
        userId: 'user-1',
        instanceId: 'instance-id',
        instanceToken: 'instance-token',
        clientToken: 'client-token',
      }),
    ).resolves.toEqual(configuration);
    expect(zApiProvider.registerCallback).toHaveBeenCalledWith({
      instanceId: 'instance-id',
      instanceToken: 'instance-token',
      clientToken: 'client-token',
      callbackUrl: expect.stringContaining('/v1/providers/z-api/callbacks/'),
    });
    expect(accountRepository.updateZApi).toHaveBeenCalledWith({
      userId: 'user-1',
      instanceId: 'instance-id',
      instanceToken: 'protected-instance-token',
      clientToken: 'protected-client-token',
      callbackTokenHash: expect.stringContaining('protected-user-1:'),
      updatedAt: expect.any(Date),
    });
  });

  it('should propagate provider failures without persisting credentials', async () => {
    vi.mocked(zApiProvider.registerCallback).mockRejectedValue(new Error('provider rejected'));

    await expect(
      sut.execute({
        userId: 'user-1',
        instanceId: 'instance-id',
        instanceToken: 'instance-token',
        clientToken: 'client-token',
      }),
    ).rejects.toThrow('provider rejected');
    expect(accountRepository.updateZApi).not.toHaveBeenCalled();
  });
});
