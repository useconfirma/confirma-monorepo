import { z } from 'zod';

export const configureWebhookBodySchema = z.object({
  url: z.string(),
  secret: z.string(),
});

export const configureWebhookResponseSchema = z.object({
  configured: z.boolean(),
  url: z.url(),
  updatedAt: z.iso.datetime(),
});
