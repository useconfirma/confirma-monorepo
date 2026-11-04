import { z } from 'zod';

const isoDateSchema = z.iso.datetime();

export const getAccountResponseSchema = z
  .object({
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
  })
  .meta({
    example: {
      account: {
        id: 'acc_123',
        name: 'Clínica Teste',
        sendWindow: {
          configured: true,
          start: '08:00',
          end: '18:00',
          timeZone: 'America/Sao_Paulo',
          updatedAt: '2026-11-04T12:00:00Z',
        },
        apiKey: { configured: true, createdAt: '2026-11-04T12:05:00Z' },
        webhook: {
          configured: true,
          url: 'https://example.com/confirma',
          updatedAt: '2026-11-04T12:10:00Z',
        },
        zApi: {
          configured: true,
          instanceId: 'instance-id',
          updatedAt: '2026-11-04T12:15:00Z',
        },
      },
    },
  });
