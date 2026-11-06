import { createHash } from 'node:crypto';
import type { SecretProtector } from '../../../modules/integrations/domain/providers/secret-protector.js';

export class Sha256SecretProtector implements SecretProtector {
    protect(value: string): string {
        return createHash('sha256').update(value).digest('hex');
    }
}
