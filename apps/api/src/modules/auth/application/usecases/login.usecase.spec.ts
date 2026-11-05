import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginUseCase } from './login.usecase.js';
import type { UserCredentials } from '../../domain/models/user.model.js';
import type { HashProvider } from '../../domain/providers/hash-provider.js';
import type { JwtProvider } from '../../domain/providers/jwt-provider.js';
import type { UserRepository } from '../../domain/repositories/user.repository.js';

describe('LoginUseCase unit tests', () => {
    const user: UserCredentials = {
        id: 'user-1',
        email: 'developer@example.com',
        passwordHash: 'stored-password-hash',
    };
    const userRepository = {
        createWithAccount: vi.fn(),
        findByEmail: vi.fn(),
        findById: vi.fn(),
    } satisfies UserRepository;
    const hashProvider = {
        hash: vi.fn(),
        compare: vi.fn(),
    } satisfies HashProvider;
    const jwtProvider = {
        sign: vi.fn(),
        verify: vi.fn(),
    } satisfies JwtProvider;
    let sut: LoginUseCase;

    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-11-04T12:00:00.000Z'));
        vi.resetAllMocks();
        sut = new LoginUseCase(userRepository, hashProvider, jwtProvider);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should authenticate the user with valid credentials', async () => {
        vi.mocked(userRepository.findByEmail).mockResolvedValue(user);
        vi.mocked(hashProvider.compare).mockResolvedValue(true);
        vi.mocked(jwtProvider.sign).mockReturnValue('session-token');

        const result = await sut.execute({
            email: user.email,
            password: 'password',
        });

        expect(result).toEqual({
            sessionToken: 'session-token',
            expiresAt: new Date('2026-11-04T20:00:00.000Z'),
        });
        expect(userRepository.findByEmail).toHaveBeenCalledWith(user.email);
        expect(hashProvider.compare).toHaveBeenCalledWith(
            'password',
            user.passwordHash,
        );
        expect(jwtProvider.sign).toHaveBeenCalledWith(
            { sub: user.id },
            { expiresIn: 8 * 60 * 60 },
        );
    });

    it('should reject an unknown user without comparing a password or creating a session', async () => {
        vi.mocked(userRepository.findByEmail).mockResolvedValue(null);

        await expect(
            sut.execute({ email: 'missing@example.com', password: 'password' }),
        ).rejects.toMatchObject({
            code: 'INVALID_CREDENTIALS',
            statusCode: 401,
        });

        expect(hashProvider.compare).not.toHaveBeenCalled();
        expect(jwtProvider.sign).not.toHaveBeenCalled();
    });

    it('should reject invalid credentials without creating a session', async () => {
        vi.mocked(userRepository.findByEmail).mockResolvedValue(user);
        vi.mocked(hashProvider.compare).mockResolvedValue(false);

        await expect(
            sut.execute({ email: user.email, password: 'wrong-password' }),
        ).rejects.toMatchObject({
            code: 'INVALID_CREDENTIALS',
            statusCode: 401,
        });

        expect(jwtProvider.sign).not.toHaveBeenCalled();
    });
});
