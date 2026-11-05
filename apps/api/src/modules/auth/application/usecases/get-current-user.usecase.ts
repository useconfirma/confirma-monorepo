import type { UserRepository } from '../../domain/repositories/user.repository.js';
import type { User } from '../../domain/models/user.model.js';
import { AppError } from '../../../../shared/domain/errors/app-error.js';

export type GetCurrentUserUseCaseInput = {
    userId: string;
};

export type GetCurrentUserUseCaseOutput = User;

export class GetCurrentUserUseCase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(
        input: GetCurrentUserUseCaseInput,
    ): Promise<GetCurrentUserUseCaseOutput> {
        const user = await this.userRepository.findById(input.userId);

        if (!user) {
            throw new AppError(
                'UNAUTHENTICATED',
                'Sessão ausente ou inválida.',
                401,
            );
        }

        return user;
    }
}
