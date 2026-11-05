import type { InvitationRepository } from '../../domain/repositories/invitation.repository.js';
import { AppError } from '../../../../shared/domain/errors/app-error.js';
import type { CryptoProvider } from '../../../../shared/domain/providers/crypto-provider.js';

export type VerifyInvitationUseCaseInput = {
    invitationToken: string;
};

export type VerifyInvitationUseCaseOutput = {
    email: string;
};

export class VerifyInvitationUseCase {
    constructor(
        private readonly invitationRepository: InvitationRepository,
        private readonly cryptoProvider: CryptoProvider,
    ) {}

    async execute(
        input: VerifyInvitationUseCaseInput,
    ): Promise<VerifyInvitationUseCaseOutput> {
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

        return { email: invitation.email };
    }
}
