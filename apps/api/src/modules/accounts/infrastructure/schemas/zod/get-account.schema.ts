import { z } from 'zod';

const isoDateSchema = z.iso.datetime();

export const getAccountResponseSchema = z.object({
  account: z.object({
    id: z.string(),
    name: z.string(),
    sendWindow: z.object({
      configured: z.boolean(),
      start: z.string().nullable(),
      end: z.string().nullable(),
      timeZone: z.string().nullable(),
      updatedAt: isoDateSchema.nullable(),
    }),
    apiKey: z.object({ configured: z.boolean(), createdAt: isoDateSchema.nullable() }),
    webhook: z.object({
      configured: z.boolean(),
      url: z.url().nullable(),
      updatedAt: isoDateSchema.nullable(),
    }),
    zApi: z.object({
      configured: z.boolean(),
      instanceId: z.string().nullable(),
      updatedAt: isoDateSchema.nullable(),
    }),
  }),
});
