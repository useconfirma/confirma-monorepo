import type { InvitationRepository } from '../../domain/repositories/invitation.repository.js';
import type { RegisteredUser } from '../../domain/models/user.model.js';
import { AppError } from '../../../../shared/domain/errors/app-error.js';
import type { CryptoProvider } from '../../../../shared/domain/providers/crypto-provider.js';
import type { HashProvider } from '../../domain/providers/hash-provider.js';
import type { RegistrationRepository } from '../../domain/repositories/registration.repository.js';
import type { MailProvider } from '../../../../shared/domain/providers/mail-provider.js';

export type AcceptInvitationUseCaseInput = {
    invitationToken: string;
    password: string;
    accountName: string;
};

export type AcceptInvitationUseCaseOutput = RegisteredUser;

export class AcceptInvitationUseCase {
    constructor(
        private readonly invitationRepository: InvitationRepository,
        private readonly registrationRepository: RegistrationRepository,
        private readonly cryptoProvider: CryptoProvider,
        private readonly hashProvider: HashProvider,
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
            throw new AppError(
                'INVITATION_UNAVAILABLE',
                'Convite indisponível.',
                410,
            );
        }

        const passwordHash = await this.hashProvider.hash(input.password);

        const registeredUser =
            await this.registrationRepository.registerWithInvitation({
                invitationId: invitation.id,
                email: invitation.email,
                passwordHash,
                accountName: input.accountName,
                usedAt: new Date(),
            });

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

        return registeredUser;
    }
}
