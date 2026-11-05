export type SendWindow = {
    configured: boolean;
    start: string | null;
    end: string | null;
    timeZone: string | null;
    updatedAt: Date | null;
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
