import { z } from 'zod';

export const configureZApiBodySchema = z.object({
  instanceId: z.string(),
  instanceToken: z.string(),
  clientToken: z.string(),
});

export const configureZApiResponseSchema = z.object({
  configured: z.boolean(),
  instanceId: z.string(),
  updatedAt: z.iso.datetime(),
});
