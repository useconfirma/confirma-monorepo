import { AppError } from '../../../../shared/domain/errors/app-error.js';
import type { AccountSummary } from '../../domain/models/account.model.js';
import type { AccountRepository } from '../../domain/repositories/account.repository.js';

export type GetAccountUseCaseInput = {
    userId: string;
};

export type GetAccountUseCaseOutput = AccountSummary;

export class GetAccountUseCase {
    constructor(private readonly accountRepository: AccountRepository) {}

    async execute(
        input: GetAccountUseCaseInput,
    ): Promise<GetAccountUseCaseOutput> {
        const account = await this.accountRepository.findSummaryByUserId(
            input.userId,
        );

        if (!account) {
            throw new AppError(
                'UNAUTHENTICATED',
                'Sessão ausente ou inválida.',
                401,
            );
        }

        return account;
    }
}
