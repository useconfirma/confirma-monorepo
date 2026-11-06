import jwt from 'jsonwebtoken';
import { AppError } from '../../../../shared/domain/errors/app-error.js';
import type {
    JwtPayload,
    JwtProvider,
    JwtSignOptions,
} from '../../domain/providers/jwt-provider.js';

export class JsonWebTokenProvider implements JwtProvider {
    constructor(private readonly secret: string) {}

    sign(payload: JwtPayload, options: JwtSignOptions): string {
        try {
            return jwt.sign(payload, this.secret, {
                expiresIn: options.expiresIn,
            });
        } catch {
            throw new AppError(
                'JWT_SIGN_FAILED',
                'Não foi possível criar a autenticação.',
                500,
            );
        }
    }

    verify(token: string): JwtPayload | null {
        try {
            const payload = jwt.verify(token, this.secret);

            if (
                typeof payload !== 'object' ||
                payload === null ||
                typeof payload.sub !== 'string'
            ) {
                return null;
            }

            return { sub: payload.sub };
        } catch {
            return null;
        }
    }
}
