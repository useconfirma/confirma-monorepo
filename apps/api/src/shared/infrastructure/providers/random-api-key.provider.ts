import { randomBytes } from 'node:crypto';
import type { ApiKeyProvider } from '../../domain/providers/api-key.provider.js';

export class RandomApiKeyProvider implements ApiKeyProvider {
    generate(): string {
        return `conf_${randomBytes(32).toString('hex')}`;
    }
}
