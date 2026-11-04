import { AppError } from '../../../../shared/domain/errors/app-error.js';
import type { SendWindow } from '../../domain/models/account.model.js';
import type {
  AccountRepository,
  UpdateSendWindowInput,
} from '../../domain/repositories/account.repository.js';

export type ConfigureSendWindowUseCaseInput = Omit<UpdateSendWindowInput, 'userId'> & {
  userId: string;
};

export type ConfigureSendWindowUseCaseOutput = SendWindow;

export class ConfigureSendWindowUseCase {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(input: ConfigureSendWindowUseCaseInput): Promise<ConfigureSendWindowUseCaseOutput> {
    this.validateTime(input.start, input.end);
    this.validateTimeZone(input.timeZone);

    return this.accountRepository.updateSendWindow(input);
  }

  private validateTime(start: string, end: string): void {
    const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

    if (!timePattern.test(start) || !timePattern.test(end) || start >= end) {
      throw new AppError('INVALID_SEND_WINDOW', 'Janela de envio inválida.', 422);
    }
  }

  private validateTimeZone(timeZone: string): void {
    if (!Intl.supportedValuesOf('timeZone').includes(timeZone)) {
      throw new AppError('INVALID_SEND_WINDOW', 'Janela de envio inválida.', 422);
    }
  }
}
