import { InvitationTokenConflictError } from '../../../domain/errors/invitation-token-conflict.error.js';
import { InvitationUnavailableError } from '../../../domain/errors/invitation-unavailable.error.js';
import { prisma } from '../../../../../shared/infrastructure/database/prisma/index.js';
import type {
    CreateInvitationInput,
    InvitationRepository,
} from '../../../domain/repositories/invitation.repository.js';
import type { Invitation } from '../../../domain/models/invitation.model.js';

export class PrismaInvitationRepository implements InvitationRepository {
    async create(input: CreateInvitationInput): Promise<Invitation> {
        const existingInvitation = await prisma.invitation.findUnique({
            where: { tokenHash: input.tokenHash },
        });

        if (existingInvitation) {
            throw new InvitationTokenConflictError();
        }

        return prisma.invitation.create({
            data: {
                email: input.email,
                tokenHash: input.tokenHash,
                expiresAt: input.expiresAt,
            },
        });
    }

    async findActiveByEmail(
        email: string,
        now: Date,
    ): Promise<Invitation | null> {
        return prisma.invitation.findFirst({
            where: {
                email,
                usedAt: null,
                expiresAt: { gt: now },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findByTokenHash(tokenHash: string): Promise<Invitation | null> {
        return prisma.invitation.findUnique({ where: { tokenHash } });
    }

    async markAsUsed(id: string, usedAt: Date): Promise<void> {
        const result = await prisma.invitation.updateMany({
            where: { id, usedAt: null, expiresAt: { gt: usedAt } },
            data: { usedAt },
        });

        if (result.count !== 1) {
            throw new InvitationUnavailableError();
        }
    }
}
