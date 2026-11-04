import { AppError } from '../../../../shared/domain/errors/app-error.js';
import type { ZApiConfiguration } from '../../domain/models/account.model.js';
import type { SecretProtector } from '../../domain/providers/secret-protector.js';
import type { ZApiProvider } from '../../domain/providers/z-api.provider.js';
import type {
  AccountRepository,
  UpdateZApiInput,
} from '../../domain/repositories/account.repository.js';

export type ConfigureZApiUseCaseInput = Omit<
  UpdateZApiInput,
  'userId' | 'callbackTokenHash' | 'updatedAt'
> & {
  userId: string;
};

export type ConfigureZApiUseCaseOutput = ZApiConfiguration;

export class ConfigureZApiUseCase {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly secretProtector: SecretProtector,
    private readonly zApiProvider: ZApiProvider,
    private readonly publicApiUrl: string,
  ) {}

  async execute(input: ConfigureZApiUseCaseInput): Promise<ConfigureZApiUseCaseOutput> {
    if (!input.instanceId || !input.instanceToken || !input.clientToken) {
      throw new AppError('ZAPI_CONFIGURATION_FAILED', 'Configuração da Z-API inválida.', 422);
    }

    const { userId, ...credentials } = input;
    const callbackToken = this.secretProtector.protect(`${userId}:${Date.now()}`);
    const callbackUrl = new URL(
      `/v1/providers/z-api/callbacks/${encodeURIComponent(callbackToken)}`,
      this.publicApiUrl,
    ).toString();

    await this.zApiProvider.registerCallback({ ...credentials, callbackUrl });

    return this.accountRepository.updateZApi({
      ...credentials,
      userId,
      instanceToken: this.secretProtector.protect(input.instanceToken),
      clientToken: this.secretProtector.protect(input.clientToken),
      callbackTokenHash: this.secretProtector.protect(callbackToken),
      updatedAt: new Date(),
    });
  }
}
