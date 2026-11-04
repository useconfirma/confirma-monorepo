import type { ApiKeyProvider } from '../../../../shared/domain/providers/api-key.provider.js';
import type { SecretProtector } from '../../domain/providers/secret-protector.js';
import type { IntegrationRepository } from '../../domain/repositories/integration.repository.js';

export type GenerateApiKeyUseCaseInput = {
  userId: string;
};

export type GenerateApiKeyUseCaseOutput = {
  apiKey: string;
  createdAt: Date;
};

export class GenerateApiKeyUseCase {
  constructor(
    private readonly integrationRepository: IntegrationRepository,
    private readonly apiKeyProvider: ApiKeyProvider,
    private readonly secretProtector: SecretProtector,
  ) {}

  async execute(input: GenerateApiKeyUseCaseInput): Promise<GenerateApiKeyUseCaseOutput> {
    const apiKey = this.apiKeyProvider.generate();
    const createdAt = new Date();

    const result = await this.integrationRepository.replaceApiKey({
      userId: input.userId,
      apiKeyHash: this.secretProtector.protect(apiKey),
      createdAt,
    });

    return { apiKey, createdAt: result.createdAt };
  }
}
