export type SendWindow = {
    configured: boolean;
    start: string | null;
    end: string | null;
    timeZone: string | null;
    updatedAt: Date | null;
};

export type SendWindowSettings = {
    start: string;
    end: string;
    timeZone: string;
};

// Janela inicial de toda conta nova; pode ser alterada pela API-07.
export const DEFAULT_SEND_WINDOW: SendWindowSettings = {
    start: '08:00',
    end: '18:00',
    timeZone: 'America/Sao_Paulo',
};

export type ApiKeySummary = {
    configured: boolean;
    createdAt: Date | null;
};

export type WebhookConfiguration = {
    configured: boolean;
    url: string | null;
    updatedAt: Date | null;
};

export type ZApiConfiguration = {
    configured: boolean;
    instanceId: string | null;
    updatedAt: Date | null;
};

export type AccountSummary = {
    id: string;
    name: string;
    sendWindow: SendWindow;
    apiKey: ApiKeySummary;
    webhook: WebhookConfiguration;
    zApi: ZApiConfiguration;
};
