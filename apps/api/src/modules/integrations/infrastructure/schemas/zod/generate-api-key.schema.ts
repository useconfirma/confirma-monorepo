import { z } from 'zod';

export const generateApiKeyResponseSchema = z
  .object({
    apiKey: z.string(),
    createdAt: z.iso.datetime(),
  })
  .meta({
    example: { apiKey: 'conf_test_0123456789abcdef', createdAt: '2026-11-04T12:05:00Z' },
  });
