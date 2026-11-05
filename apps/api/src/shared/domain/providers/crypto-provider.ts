export interface CryptoProvider {
    generateToken(): string;
    hashToken(token: string): string;
}
