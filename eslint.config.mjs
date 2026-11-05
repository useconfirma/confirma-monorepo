import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default defineConfig([
    globalIgnores([
        '**/node_modules/',
        '**/dist/',
        '**/build/',
        '**/coverage/',
        '**/.turbo/',
        '**/.astro/',
        '**/routeTree.gen.ts',
    ]),
    js.configs.recommended,
    tseslint.configs.recommended,
    prettier,
]);
