export type CookieSameSite = 'lax' | 'strict' | 'none';

export type CookieOptions = {
  httpOnly: boolean;
  secure: boolean;
  sameSite: CookieSameSite;
  path: string;
  maxAge?: number;
};

export type RemoveCookieOptions = Pick<CookieOptions, 'secure' | 'sameSite' | 'path'>;

export interface CookieProvider {
  get(name: string): string | undefined;
  set(name: string, value: string, options: CookieOptions): void;
  remove(name: string, options: RemoveCookieOptions): void;
}
