import { beforeEach, describe, expect, it, vi } from 'vitest';
import { VerifyInvitationUseCase } from './verify-invitation.usecase.js';
import type { Invitation } from '../../domain/models/invitation.model.js';
import type { CryptoProvider } from '../../../../shared/domain/providers/crypto-provider.js';
import type { InvitationRepository } from '../../domain/repositories/invitation.repository.js';

describe('VerifyInvitationUseCase unit tests', () => {
  const invitationToken = 'invitation-token';
  const invitation: Invitation = {
    id: 'invitation-1',
    email: 'developer@example.com',
    tokenHash: 'hashed-invitation-token',
    expiresAt: new Date('2026-11-10T00:00:00.000Z'),
    usedAt: null,
  };
  const invitationRepository = {
    create: vi.fn(),
    findActiveByEmail: vi.fn(),
    findByTokenHash: vi.fn(),
    markAsUsed: vi.fn(),
  } satisfies InvitationRepository;
  const cryptoProvider = {
    generateToken: vi.fn(),
    hashToken: vi.fn(),
  } satisfies CryptoProvider;
  let sut: VerifyInvitationUseCase;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-04T12:00:00.000Z'));
    vi.resetAllMocks();
    sut = new VerifyInvitationUseCase(invitationRepository, cryptoProvider);
  });

  it('should return the email for a valid invitation', async () => {
    vi.mocked(cryptoProvider.hashToken).mockReturnValue(invitation.tokenHash);
    vi.mocked(invitationRepository.findByTokenHash).mockResolvedValue(invitation);

    const result = await sut.execute({ invitationToken });

    expect(result).toEqual({ email: invitation.email });
    expect(cryptoProvider.hashToken).toHaveBeenCalledWith(invitationToken);
    expect(invitationRepository.findByTokenHash).toHaveBeenCalledWith(invitation.tokenHash);
  });

  it.each([
    ['an unknown invitation', null],
    ['a used invitation', { ...invitation, usedAt: new Date('2026-11-01T00:00:00.000Z') }],
    ['an expired invitation', { ...invitation, expiresAt: new Date('2026-11-01T00:00:00.000Z') }],
  ])('should reject %s', async (_description, result) => {
    vi.mocked(cryptoProvider.hashToken).mockReturnValue(invitation.tokenHash);
    vi.mocked(invitationRepository.findByTokenHash).mockResolvedValue(result);

    await expect(sut.execute({ invitationToken })).rejects.toMatchObject({
      code: 'INVITATION_UNAVAILABLE',
      statusCode: 410,
    });
  });
});
