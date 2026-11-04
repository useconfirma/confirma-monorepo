import { AppError } from '../../../../shared/domain/errors/app-error.js';
import type { WebhookConfiguration } from '../../domain/models/account.model.js';
import type { SecretProtector } from '../../domain/providers/secret-protector.js';
import type {
  AccountRepository,
  UpdateWebhookInput,
} from '../../domain/repositories/account.repository.js';

export type ConfigureWebhookUseCaseInput = Omit<
  UpdateWebhookInput,
  'userId' | 'secretHash' | 'updatedAt'
> & {
  userId: string;
  secret: string;
};

export type ConfigureWebhookUseCaseOutput = WebhookConfiguration;

export class ConfigureWebhookUseCase {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly secretProtector: SecretProtector,
  ) {}

  async execute(input: ConfigureWebhookUseCaseInput): Promise<ConfigureWebhookUseCaseOutput> {
    this.validate(input.url, input.secret);

    return this.accountRepository.updateWebhook({
      userId: input.userId,
      url: input.url,
      secretHash: this.secretProtector.protect(input.secret),
      updatedAt: new Date(),
    });
  }

  private validate(url: string, secret: string): void {
    if (!URL.canParse(url) || new URL(url).protocol !== 'https:') {
      throw new AppError('INVALID_WEBHOOK', 'Webhook inválido.', 422);
    }

    if (secret.length === 0) {
      throw new AppError('INVALID_WEBHOOK', 'Webhook inválido.', 422);
    }
  }
}
