import type { UserRepository } from '../../domain/repositories/user.repository.js';

export type LoginUseCaseInput = {
  email: string;
  password: string;
};

export type LoginUseCaseOutput = {
  sessionToken: string;
  expiresAt: Date;
};

export class LoginUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: LoginUseCaseInput): Promise<LoginUseCaseOutput> {
    void input;
    throw new Error('Not implemented');
  }
}
