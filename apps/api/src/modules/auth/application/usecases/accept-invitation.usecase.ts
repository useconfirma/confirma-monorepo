import type { InvitationRepository } from '../../domain/repositories/invitation.repository.js';
import type { RegisteredUser } from '../../domain/models/user.model.js';
import type { UserRepository } from '../../domain/repositories/user.repository.js';

export type AcceptInvitationUseCaseInput = {
  invitationToken: string;
  password: string;
  accountName: string;
};

export type AcceptInvitationUseCaseOutput = RegisteredUser;

export class AcceptInvitationUseCase {
  constructor(
    private readonly invitationRepository: InvitationRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: AcceptInvitationUseCaseInput): Promise<AcceptInvitationUseCaseOutput> {
    void input;
    throw new Error('Not implemented');
  }
}
