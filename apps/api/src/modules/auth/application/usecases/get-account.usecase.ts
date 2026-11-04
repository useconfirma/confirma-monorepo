type SendWindow = {
  configured: boolean;
  start: string | null;
  end: string | null;
  timeZone: string | null;
  updatedAt: Date | null;
};

type ApiKey = {
  configured: boolean;
  createdAt: Date | null;
};

type Webhook = {
  configured: boolean;
  url: string | null;
  updatedAt: Date | null;
};

type ZApi = {
  configured: boolean;
  instanceId: string | null;
  updatedAt: Date | null;
};

export type GetAccountUseCaseInput = {
  userId: string;
};

export type GetAccountUseCaseOutput = {
  id: string;
  name: string;
  sendWindow: SendWindow;
  apiKey: ApiKey;
  webhook: Webhook;
  zApi: ZApi;
};

export class GetAccountUseCase {
  async execute(input: GetAccountUseCaseInput): Promise<GetAccountUseCaseOutput> {
    void input;
    throw new Error('Not implemented');
  }
}
