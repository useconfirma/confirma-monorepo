import { DEFAULT_SEND_WINDOW } from '../../../accounts/domain/models/account.model.js';
import type { InvitationRepository } from '../../domain/repositories/invitation.repository.js';
import type { RegisteredUser } from '../../domain/models/user.model.js';
import { InvitationUnavailableError } from '../../domain/errors/invitation-unavailable.error.js';
import type { CryptoProvider } from '../../../../shared/domain/providers/crypto-provider.js';
import type { HashProvider } from '../../domain/providers/hash-provider.js';
import type { JwtProvider } from '../../domain/providers/jwt-provider.js';
import type { UserRepository } from '../../domain/repositories/user.repository.js';
import type { MailProvider } from '../../../../shared/domain/providers/mail-provider.js';

export type AcceptInvitationUseCaseInput = {
    invitationToken: string;
    password: string;
    accountName: string;
};

export type AcceptInvitationUseCaseOutput = RegisteredUser & {
    sessionToken: string;
    expiresAt: Date;
};

export class AcceptInvitationUseCase {
    constructor(
        private readonly invitationRepository: InvitationRepository,
        private readonly userRepository: UserRepository,
        private readonly cryptoProvider: CryptoProvider,
        private readonly hashProvider: HashProvider,
        private readonly jwtProvider: JwtProvider,
        private readonly mailProvider: MailProvider,
        private readonly publicAppUrl: string,
    ) {}

    async execute(
        input: AcceptInvitationUseCaseInput,
    ): Promise<AcceptInvitationUseCaseOutput> {
        const invitation = await this.invitationRepository.findByTokenHash(
            this.cryptoProvider.hashToken(input.invitationToken),
        );

        if (
            !invitation ||
            invitation.usedAt ||
            invitation.expiresAt <= new Date()
        ) {
            throw new InvitationUnavailableError();
        }

        const passwordHash = await this.hashProvider.hash(input.password);

        const registeredUser = await this.userRepository.registerWithInvitation(
            {
                invitationId: invitation.id,
                email: invitation.email,
                passwordHash,
                accountName: input.accountName,
                sendWindow: DEFAULT_SEND_WINDOW,
                usedAt: new Date(),
            },
        );

        const dashboardUrl = new URL('/', this.publicAppUrl).toString();

        await this.mailProvider.send({
            to: registeredUser.user.email,
            subject: 'Bem-vindo ao Confirma',
            text: [
                `Olá, ${registeredUser.user.email}.`,
                '',
                'Bem-vindo ao Confirma!',
                'Obrigado por participar do Beta. Sua conta foi criada com sucesso.',
                '',
                `Acesse seu painel para começar: ${dashboardUrl}`,
            ].join('\n'),
        });

        const expiresIn = 8 * 60 * 60;
        const expiresAt = new Date(Date.now() + expiresIn * 1000);
        const sessionToken = this.jwtProvider.sign(
            { sub: registeredUser.user.id },
            { expiresIn },
        );

        return { ...registeredUser, sessionToken, expiresAt };
    }
}
