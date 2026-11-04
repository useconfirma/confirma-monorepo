import type {
  AccountSummary,
  SendWindow,
  WebhookConfiguration,
  ZApiConfiguration,
} from '../models/account.model.js';

export type UpdateSendWindowInput = {
  userId: string;
  start: string;
  end: string;
  timeZone: string;
};

export type ReplaceApiKeyInput = {
  userId: string;
  apiKeyHash: string;
  createdAt: Date;
};

export type UpdateWebhookInput = {
  userId: string;
  url: string;
  secretHash: string;
  updatedAt: Date;
};

export type UpdateZApiInput = {
  userId: string;
  instanceId: string;
  instanceToken: string;
  clientToken: string;
  callbackTokenHash: string;
  updatedAt: Date;
};

export interface AccountRepository {
  findSummaryByUserId(userId: string): Promise<AccountSummary | null>;
  updateSendWindow(input: UpdateSendWindowInput): Promise<SendWindow>;
  replaceApiKey(input: ReplaceApiKeyInput): Promise<{ createdAt: Date }>;
  updateWebhook(input: UpdateWebhookInput): Promise<WebhookConfiguration>;
  updateZApi(input: UpdateZApiInput): Promise<ZApiConfiguration>;
}
