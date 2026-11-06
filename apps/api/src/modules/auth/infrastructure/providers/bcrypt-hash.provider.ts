import bcrypt from 'bcrypt';
import { AppError } from '../../../../shared/domain/errors/app-error.js';
import type { HashProvider } from '../../domain/providers/hash-provider.js';

export class BcryptHashProvider implements HashProvider {
    constructor(private readonly saltRounds = 12) {}

    async hash(value: string): Promise<string> {
        try {
            return await bcrypt.hash(value, this.saltRounds);
        } catch {
            throw new AppError(
                'PASSWORD_HASH_FAILED',
                'Não foi possível proteger a credencial.',
                500,
            );
        }
    }

    async compare(value: string, hash: string): Promise<boolean> {
        try {
            return await bcrypt.compare(value, hash);
        } catch {
            throw new AppError(
                'PASSWORD_COMPARISON_FAILED',
                'Não foi possível validar a credencial.',
                500,
            );
        }
    }
}
