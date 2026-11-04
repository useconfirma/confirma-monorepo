export type LogoutUseCaseInput = {
  sessionToken: string;
};

export type LogoutUseCaseOutput = void;

export class LogoutUseCase {
  async execute(input: LogoutUseCaseInput): Promise<LogoutUseCaseOutput> {
    void input;
  }
}
