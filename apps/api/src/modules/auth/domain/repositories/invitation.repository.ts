import type { Invitation } from '../models/invitation.model.js';

export type CreateInvitationInput = {
    email: string;
    tokenHash: string;
    expiresAt: Date;
};

export interface InvitationRepository {
    create(input: CreateInvitationInput): Promise<Invitation>;
    findActiveByEmail(email: string, now: Date): Promise<Invitation | null>;
    findByTokenHash(tokenHash: string): Promise<Invitation | null>;
    markAsUsed(id: string, usedAt: Date): Promise<void>;
}
