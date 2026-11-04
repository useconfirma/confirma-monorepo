export type AccountSummary = {
  id: string;
  name: string;
  sendWindow: {
    configured: boolean;
    start: string | null;
    end: string | null;
    timeZone: string | null;
    updatedAt: Date | null;
  };
  apiKey: {
    configured: boolean;
    createdAt: Date | null;
  };
  webhook: {
    configured: boolean;
    url: string | null;
    updatedAt: Date | null;
  };
  zApi: {
    configured: boolean;
    instanceId: string | null;
    updatedAt: Date | null;
  };
};

export interface AccountRepository {
  findSummaryByUserId(userId: string): Promise<AccountSummary | null>;
}
