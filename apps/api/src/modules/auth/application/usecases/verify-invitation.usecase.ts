import type { InvitationRepository } from '../../domain/repositories/invitation.repository.js';

export type VerifyInvitationUseCaseInput = {
  invitationToken: string;
};

export type VerifyInvitationUseCaseOutput = {
  email: string;
};

export class VerifyInvitationUseCase {
  constructor(private readonly invitationRepository: InvitationRepository) {}

  async execute(input: VerifyInvitationUseCaseInput): Promise<VerifyInvitationUseCaseOutput> {
    void input;
    throw new Error('Not implemented');
  }
}
