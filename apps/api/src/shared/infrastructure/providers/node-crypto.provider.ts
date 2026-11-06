import { createHash, randomBytes } from 'node:crypto';
import type { CryptoProvider } from '../../domain/providers/crypto-provider.js';

export class NodeCryptoProvider implements CryptoProvider {
    generateToken(): string {
        return randomBytes(32).toString('hex');
    }

    hashToken(token: string): string {
        return createHash('sha256').update(token).digest('hex');
    }
}
