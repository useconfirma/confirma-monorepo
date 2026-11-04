export type GetAccountUseCaseInput = {
  userId: string;
};

export type GetAccountUseCaseOutput = AccountSummary;

export class GetAccountUseCase {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(input: GetAccountUseCaseInput): Promise<GetAccountUseCaseOutput> {
    const account = await this.accountRepository.findSummaryByUserId(input.userId);

    if (!account) {
      throw new AppError('UNAUTHENTICATED', 'Sessão ausente ou inválida.', 401);
    }

    return account;
  }
}
import { AppError } from '../../../../shared/domain/errors/app-error.js';
import type {
  AccountSummary,
  AccountRepository,
} from '../../domain/repositories/account.repository.js';
