import type { Request, Response } from 'express';
import type {
    CookieOptions,
    CookieProvider,
    RemoveCookieOptions,
} from '../../domain/providers/cookie-provider.js';

export class ExpressCookieProvider implements CookieProvider {
    constructor(
        private readonly request: Request,
        private readonly response: Response,
    ) {}

    get(name: string): string | undefined {
        return this.request.cookies?.[name];
    }

    set(name: string, value: string, options: CookieOptions): void {
        this.response.cookie(name, value, options);
    }

    remove(name: string, options: RemoveCookieOptions): void {
        this.response.clearCookie(name, options);
    }
}
