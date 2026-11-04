import { z } from 'zod';

export const configureWebhookBodySchema = z
  .object({
    url: z.string(),
    secret: z.string(),
  })
  .meta({
    example: { url: 'https://example.com/confirma', secret: 'webhook-secret-test' },
  });

export const configureWebhookResponseSchema = z
  .object({
    configured: z.boolean(),
    url: z.url(),
    updatedAt: z.iso.datetime(),
  })
  .meta({
    example: {
      configured: true,
      url: 'https://example.com/confirma',
      updatedAt: '2026-11-04T12:10:00Z',
    },
  });
