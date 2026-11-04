import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RequestInvitationUseCase } from './request-invitation.usecase.js';
import type { CryptoProvider } from '../../../../shared/domain/providers/crypto-provider.js';
import type { MailProvider } from '../../../../shared/domain/providers/mail-provider.js';
import type { InvitationRepository } from '../../domain/repositories/invitation.repository.js';

describe('RequestInvitationUseCase unit tests', () => {
  const email = 'developer@example.com';
  const invitationRepository = {
    findByTokenHash: vi.fn(),
    findActiveByEmail: vi.fn(),
    create: vi.fn(),
    markAsUsed: vi.fn(),
  } satisfies InvitationRepository;
  const cryptoProvider = {
    generateToken: vi.fn(),
    hashToken: vi.fn(),
  } satisfies Pick<CryptoProvider, 'generateToken' | 'hashToken'>;
  const mailProvider = {
    send: vi.fn(),
  } satisfies Pick<MailProvider, 'send'>;
  let sut: RequestInvitationUseCase;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-04T12:00:00.000Z'));
    vi.resetAllMocks();
    sut = new RequestInvitationUseCase(
      invitationRepository,
      cryptoProvider,
      mailProvider,
      'https://app.example.com',
    );
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should accept an invitation request and send a new invitation', async () => {
    vi.mocked(invitationRepository.findActiveByEmail).mockResolvedValue(null);
    vi.mocked(cryptoProvider.generateToken).mockReturnValue('new-token');
    vi.mocked(cryptoProvider.hashToken).mockReturnValue('hashed-token');
    vi.mocked(invitationRepository.create).mockResolvedValue({
      id: 'invitation-1',
      email,
      tokenHash: 'hashed-token',
      expiresAt: new Date('2026-11-07T12:00:00.000Z'),
      usedAt: null,
    });
    vi.mocked(mailProvider.send).mockResolvedValue(undefined);

    const result = await sut.execute({ email });

    expect(result).toEqual({ accepted: true });
    expect(invitationRepository.findActiveByEmail).toHaveBeenCalledWith(
      email,
      new Date('2026-11-04T12:00:00.000Z'),
    );
    expect(invitationRepository.create).toHaveBeenCalledWith({
      email,
      tokenHash: 'hashed-token',
      expiresAt: new Date('2026-11-07T12:00:00.000Z'),
    });
    expect(mailProvider.send).toHaveBeenCalledWith({
      to: email,
      subject: 'Convite para o Confirma',
      text: expect.stringContaining('https://app.example.com/invitations/new-token'),
    });
  });

  it('should accept an invitation request without creating a duplicate active invitation', async () => {
    vi.mocked(invitationRepository.findActiveByEmail).mockResolvedValue({
      id: 'existing-invitation',
      email,
      tokenHash: 'existing-token-hash',
      expiresAt: new Date('2026-11-07T12:00:00.000Z'),
      usedAt: null,
    });

    const result = await sut.execute({ email });

    expect(result).toEqual({ accepted: true });
    expect(invitationRepository.create).not.toHaveBeenCalled();
    expect(cryptoProvider.generateToken).not.toHaveBeenCalled();
    expect(mailProvider.send).not.toHaveBeenCalled();
  });
});
