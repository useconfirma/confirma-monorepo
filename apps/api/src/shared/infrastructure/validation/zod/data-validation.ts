import type { z } from 'zod';

import { AppError } from '../../../domain/errors/app-error.js';

export function validateData<TSchema extends z.ZodType>(
  data: unknown,
  schema: TSchema,
): z.output<TSchema> {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new AppError('VALIDATION_ERROR', 'Dados inválidos.', 400);
  }

  return result.data;
}
