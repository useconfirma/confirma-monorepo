import type { AccountSummary } from '../models/account.model.js';

export interface AccountRepository {
  findSummaryByUserId(userId: string): Promise<AccountSummary | null>;
}
