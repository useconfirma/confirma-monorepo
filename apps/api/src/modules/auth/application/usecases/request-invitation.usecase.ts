import type { InvitationRepository } from '../../domain/repositories/invitation.repository.js';

export type RequestInvitationUseCaseInput = {
  email: string;
};

export type RequestInvitationUseCaseOutput = {
  accepted: true;
};

export class RequestInvitationUseCase {
  constructor(private readonly invitationRepository: InvitationRepository) {}

  async execute(input: RequestInvitationUseCaseInput): Promise<RequestInvitationUseCaseOutput> {
    void input;
    throw new Error('Not implemented');
  }
}
