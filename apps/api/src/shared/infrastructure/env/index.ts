import { z } from 'zod';

import { AppError } from '../../domain/errors/app-error.js';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  throw new AppError(
    'INVALID_ENVIRONMENT_VARIABLES',
    `Variáveis de ambiente inválidas:\n${z.prettifyError(parsed.error)}`,
    500,
  );
}

export const env = parsed.data;
