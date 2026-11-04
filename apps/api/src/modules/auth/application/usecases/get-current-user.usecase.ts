import type { UserRepository } from '../../domain/repositories/user.repository.js';
import type { User } from '../../domain/models/user.model.js';

export type GetCurrentUserUseCaseInput = {
  userId: string;
};

export type GetCurrentUserUseCaseOutput = User;

export class GetCurrentUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: GetCurrentUserUseCaseInput): Promise<GetCurrentUserUseCaseOutput> {
    void input;
    throw new Error('Not implemented');
  }
}
