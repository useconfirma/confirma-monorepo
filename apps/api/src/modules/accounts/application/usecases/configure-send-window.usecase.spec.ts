import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConfigureSendWindowUseCase } from './configure-send-window.usecase.js';
import type { SendWindow } from '../../domain/models/account.model.js';
import type { AccountRepository } from '../../domain/repositories/account.repository.js';

describe('ConfigureSendWindowUseCase unit tests', () => {
  const configuredWindow: SendWindow = {
    configured: true,
    start: '08:00',
    end: '18:00',
    timeZone: 'America/Sao_Paulo',
    updatedAt: new Date('2026-11-04T12:00:00.000Z'),
  };
  const accountRepository = {
    findSummaryByUserId: vi.fn(),
    updateSendWindow: vi.fn(),
    replaceApiKey: vi.fn(),
    updateWebhook: vi.fn(),
    updateZApi: vi.fn(),
  } satisfies AccountRepository;
  let sut: ConfigureSendWindowUseCase;

  beforeEach(() => {
    vi.resetAllMocks();
    sut = new ConfigureSendWindowUseCase(accountRepository);
  });

  it('should persist a valid send window', async () => {
    vi.mocked(accountRepository.updateSendWindow).mockResolvedValue(configuredWindow);

    await expect(
      sut.execute({
        userId: 'user-1',
        start: '08:00',
        end: '18:00',
        timeZone: 'America/Sao_Paulo',
      }),
    ).resolves.toEqual(configuredWindow);
    expect(accountRepository.updateSendWindow).toHaveBeenCalledWith({
      userId: 'user-1',
      start: '08:00',
      end: '18:00',
      timeZone: 'America/Sao_Paulo',
    });
  });

  it.each([
    ['an invalid time format', '8:00', '18:00', 'America/Sao_Paulo'],
    ['a window that crosses midnight', '22:00', '02:00', 'America/Sao_Paulo'],
    ['an invalid time zone', '08:00', '18:00', 'Not/A_TimeZone'],
  ])(
    'should reject %s without updating the account',
    async (_description, start, end, timeZone) => {
      await expect(sut.execute({ userId: 'user-1', start, end, timeZone })).rejects.toMatchObject({
        code: 'INVALID_SEND_WINDOW',
        statusCode: 422,
      });
      expect(accountRepository.updateSendWindow).not.toHaveBeenCalled();
    },
  );
});
