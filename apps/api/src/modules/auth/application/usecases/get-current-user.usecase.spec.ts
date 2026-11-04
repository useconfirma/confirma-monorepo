import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GetCurrentUserUseCase } from './get-current-user.usecase.js';
import type { User } from '../../domain/models/user.model.js';
import type { UserRepository } from '../../domain/repositories/user.repository.js';

describe('GetCurrentUserUseCase unit tests', () => {
  const user: User = { id: 'user-1', email: 'developer@example.com' };
  const userRepository = {
    createWithAccount: vi.fn(),
    findByEmail: vi.fn(),
    findById: vi.fn(),
  } satisfies UserRepository;
  let sut: GetCurrentUserUseCase;

  beforeEach(() => {
    vi.resetAllMocks();
    sut = new GetCurrentUserUseCase(userRepository);
  });

  it('should return the current user', async () => {
    vi.mocked(userRepository.findById).mockResolvedValue(user);

    const result = await sut.execute({ userId: user.id });

    expect(result).toEqual(user);
    expect(userRepository.findById).toHaveBeenCalledWith(user.id);
  });

  it('should reject an unknown current user', async () => {
    vi.mocked(userRepository.findById).mockResolvedValue(null);

    await expect(sut.execute({ userId: 'missing-user' })).rejects.toMatchObject({
      code: 'UNAUTHENTICATED',
      statusCode: 401,
    });
  });
});
