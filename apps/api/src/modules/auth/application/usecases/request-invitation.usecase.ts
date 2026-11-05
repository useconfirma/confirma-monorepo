import type { InvitationRepository } from '../../domain/repositories/invitation.repository.js';
import type { CryptoProvider } from '../../../../shared/domain/providers/crypto-provider.js';
import type { MailProvider } from '../../../../shared/domain/providers/mail-provider.js';

export type RequestInvitationUseCaseInput = {
    email: string;
};

export type RequestInvitationUseCaseOutput = {
    accepted: true;
};

export class RequestInvitationUseCase {
    constructor(
        private readonly invitationRepository: InvitationRepository,
        private readonly cryptoProvider: CryptoProvider,
        private readonly mailProvider: MailProvider,
        private readonly publicAppUrl: string,
    ) {}

    async execute(
        input: RequestInvitationUseCaseInput,
    ): Promise<RequestInvitationUseCaseOutput> {
        const now = new Date();
        const activeInvitation =
            await this.invitationRepository.findActiveByEmail(input.email, now);

        if (activeInvitation) {
            return { accepted: true };
        }

        const token = this.cryptoProvider.generateToken();
        const invitation = await this.invitationRepository.create({
            email: input.email,
            tokenHash: this.cryptoProvider.hashToken(token),
            expiresAt: new Date(now.getTime() + 72 * 60 * 60 * 1000),
        });

        const invitationUrl = new URL(
            `/invitations/${encodeURIComponent(token)}`,
            this.publicAppUrl,
        ).toString();

        await this.mailProvider.send({
            to: invitation.email,
            subject: 'Convite para o Confirma',
            text: [
                'Você foi convidado para o Confirma.',
                '',
                'Crie sua conta para participar do Beta:',
                invitationUrl,
                '',
                `Este convite é válido até ${invitation.expiresAt.toISOString()}.`,
            ].join('\n'),
        });

        return { accepted: true };
    }
}
