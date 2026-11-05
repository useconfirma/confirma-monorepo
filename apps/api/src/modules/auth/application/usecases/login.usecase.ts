import { AppError } from '../../../../shared/domain/errors/app-error.js';
import type { HashProvider } from '../../domain/providers/hash-provider.js';
import type { JwtProvider } from '../../domain/providers/jwt-provider.js';
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
    constructor(
        private readonly userRepository: UserRepository,
        private readonly hashProvider: HashProvider,
        private readonly jwtProvider: JwtProvider,
    ) {}

    async execute(input: LoginUseCaseInput): Promise<LoginUseCaseOutput> {
        const user = await this.userRepository.findByEmail(input.email);

        const isPasswordValid = user
            ? await this.hashProvider.compare(input.password, user.passwordHash)
            : false;

        if (!user || !isPasswordValid) {
            throw new AppError(
                'INVALID_CREDENTIALS',
                'Credenciais inválidas.',
                401,
            );
        }

        const expiresIn = 8 * 60 * 60;
        const expiresAt = new Date(Date.now() + expiresIn * 1000);
        const sessionToken = this.jwtProvider.sign(
            { sub: user.id },
            { expiresIn },
        );

        return { sessionToken, expiresAt };
    }
}
