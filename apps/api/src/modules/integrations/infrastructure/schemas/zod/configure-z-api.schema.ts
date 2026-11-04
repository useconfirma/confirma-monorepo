import { z } from 'zod';

export const configureZApiBodySchema = z
  .object({
    instanceId: z.string(),
    instanceToken: z.string(),
    clientToken: z.string(),
  })
  .meta({
    example: {
      instanceId: 'instance-id',
      instanceToken: 'instance-token-test',
      clientToken: 'client-token-test',
    },
  });

export const configureZApiResponseSchema = z
  .object({
    configured: z.boolean(),
    instanceId: z.string(),
    updatedAt: z.iso.datetime(),
  })
  .meta({
    example: {
      configured: true,
      instanceId: 'instance-id',
      updatedAt: '2026-11-04T12:15:00Z',
    },
  });
