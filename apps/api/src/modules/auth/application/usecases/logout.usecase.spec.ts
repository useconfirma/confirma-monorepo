import { beforeEach, describe, it, vi } from 'vitest';
import { LogoutUseCase } from './logout.usecase.js';

describe('LogoutUseCase unit tests', () => {
  let sut: LogoutUseCase;

  beforeEach(() => {
    vi.resetAllMocks();
    sut = new LogoutUseCase();
    void sut;
  });

  it.todo('should invalidate the current session');
});
