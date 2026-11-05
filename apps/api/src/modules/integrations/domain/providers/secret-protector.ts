export interface SecretProtector {
    protect(value: string): string;
}
