import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AcceptInvitationUseCase } from './accept-invitation.usecase.js';
import type { Invitation } from '../../domain/models/invitation.model.js';
import type { RegisteredUser } from '../../domain/models/user.model.js';
import type { CryptoProvider } from '../../../../shared/domain/providers/crypto-provider.js';
import type { HashProvider } from '../../domain/providers/hash-provider.js';
import type { MailProvider } from '../../../../shared/domain/providers/mail-provider.js';
import type { InvitationRepository } from '../../domain/repositories/invitation.repository.js';
import type { RegistrationRepository } from '../../domain/repositories/registration.repository.js';

describe('AcceptInvitationUseCase unit tests', () => {
  const invitationToken = 'invitation-token';
  const invitation: Invitation = {
    id: 'invitation-1',
    email: 'developer@example.com',
    tokenHash: 'hashed-invitation-token',
    expiresAt: new Date('2026-11-10T00:00:00.000Z'),
    usedAt: null,
  };
  const registeredUser: RegisteredUser = {
    user: { id: 'user-1', email: invitation.email },
    account: { id: 'account-1', name: 'Test Account' },
  };
  const invitationRepository = {
    create: vi.fn(),
    findActiveByEmail: vi.fn(),
    findByTokenHash: vi.fn(),
    markAsUsed: vi.fn(),
  } satisfies InvitationRepository;
  const registrationRepository = {
    registerWithInvitation: vi.fn(),
  } satisfies Pick<RegistrationRepository, 'registerWithInvitation'>;
  const cryptoProvider = {
    generateToken: vi.fn(),
    hashToken: vi.fn(),
  } satisfies CryptoProvider;
  const hashProvider = {
    hash: vi.fn(),
    compare: vi.fn(),
  } satisfies HashProvider;
  const mailProvider = {
    send: vi.fn(),
  } satisfies Pick<MailProvider, 'send'>;
  let sut: AcceptInvitationUseCase;

  beforeEach(() => {
    vi.resetAllMocks();
    sut = new AcceptInvitationUseCase(
      invitationRepository,
      registrationRepository,
      cryptoProvider,
      hashProvider,
      mailProvider,
      'https://app.example.com',
    );
  });

  it('should register the user and send a welcome email for a valid invitation', async () => {
    vi.mocked(cryptoProvider.hashToken).mockReturnValue(invitation.tokenHash);
    vi.mocked(invitationRepository.findByTokenHash).mockResolvedValue(invitation);
    vi.mocked(hashProvider.hash).mockResolvedValue('password-hash');
    vi.mocked(registrationRepository.registerWithInvitation).mockResolvedValue(registeredUser);
    vi.mocked(mailProvider.send).mockResolvedValue(undefined);

    const result = await sut.execute({
      invitationToken,
      password: 'password',
      accountName: 'Test Account',
    });

    expect(result).toEqual(registeredUser);
    expect(cryptoProvider.hashToken).toHaveBeenCalledWith(invitationToken);
    expect(registrationRepository.registerWithInvitation).toHaveBeenCalledWith({
      invitationId: invitation.id,
      email: invitation.email,
      passwordHash: 'password-hash',
      accountName: 'Test Account',
      usedAt: expect.any(Date),
    });
    expect(mailProvider.send).toHaveBeenCalledWith({
      to: registeredUser.user.email,
      subject: 'Bem-vindo ao Confirma',
      text: expect.stringContaining('https://app.example.com/'),
    });
  });

  it.each([
    ['an unknown invitation', null],
    ['a used invitation', { ...invitation, usedAt: new Date('2026-11-01T00:00:00.000Z') }],
    ['an expired invitation', { ...invitation, expiresAt: new Date('2026-11-01T00:00:00.000Z') }],
  ])('should reject %s without registering or sending email', async (_description, result) => {
    vi.mocked(cryptoProvider.hashToken).mockReturnValue(invitation.tokenHash);
    vi.mocked(invitationRepository.findByTokenHash).mockResolvedValue(result);

    await expect(
      sut.execute({ invitationToken, password: 'password', accountName: 'Test Account' }),
    ).rejects.toMatchObject({ code: 'INVITATION_UNAVAILABLE', statusCode: 410 });

    expect(hashProvider.hash).not.toHaveBeenCalled();
    expect(registrationRepository.registerWithInvitation).not.toHaveBeenCalled();
    expect(mailProvider.send).not.toHaveBeenCalled();
  });
});
