export type JwtPayload = {
  sub: string;
};

export type JwtSignOptions = {
  expiresIn: number;
};

export interface JwtProvider {
  sign(payload: JwtPayload, options: JwtSignOptions): string;
  verify(token: string): JwtPayload | null;
}
