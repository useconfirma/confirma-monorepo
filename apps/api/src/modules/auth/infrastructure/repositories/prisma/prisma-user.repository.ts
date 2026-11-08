import { EmailAlreadyRegisteredError } from '../../../domain/errors/email-already-registered.error.js';
import { InvitationUnavailableError } from '../../../domain/errors/invitation-unavailable.error.js';
import { prisma } from '../../../../../shared/infrastructure/database/prisma/index.js';
import type {
    CreateUserWithAccountInput,
    RegisterUserWithInvitationInput,
    UserRepository,
} from '../../../domain/repositories/user.repository.js';
import type {
    RegisteredUser,
    User,
    UserCredentials,
} from '../../../domain/models/user.model.js';
import type { Prisma } from '../../../../../shared/infrastructure/database/prisma/generated/client.js';

export class PrismaUserRepository implements UserRepository {
    async createWithAccount(
        input: CreateUserWithAccountInput,
    ): Promise<RegisteredUser> {
        const existingUser = await prisma.user.findUnique({
            where: { email: input.email },
        });

        if (existingUser) {
            throw new EmailAlreadyRegisteredError();
        }

        return prisma.$transaction(async (transaction) => {
            return this.createRegisteredUser(transaction, input);
        });
    }

    async findByEmail(email: string): Promise<UserCredentials | null> {
        return prisma.user.findUnique({ where: { email } });
    }

    async findById(id: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { id } });
    }

    async registerWithInvitation(
        input: RegisterUserWithInvitationInput,
    ): Promise<RegisteredUser> {
        return prisma.$transaction(async (transaction) => {
            const invitation = await this.findRegistrationInvitation(
                transaction,
                input,
            );
            await this.ensureEmailIsAvailable(transaction, invitation.email);
            await this.consumeInvitation(transaction, input);

            return this.createRegisteredUser(transaction, {
                email: invitation.email,
                passwordHash: input.passwordHash,
                accountName: input.accountName,
                sendWindow: input.sendWindow,
            });
        });
    }

    private async findRegistrationInvitation(
        transaction: Prisma.TransactionClient,
        input: RegisterUserWithInvitationInput,
    ) {
        const invitation = await transaction.invitation.findUnique({
            where: { id: input.invitationId },
        });

        if (
            !invitation ||
            invitation.email !== input.email ||
            invitation.usedAt ||
            invitation.expiresAt <= input.usedAt
        ) {
            throw new InvitationUnavailableError();
        }

        return invitation;
    }

    private async ensureEmailIsAvailable(
        transaction: Prisma.TransactionClient,
        email: string,
    ): Promise<void> {
        const existingUser = await transaction.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new EmailAlreadyRegisteredError();
        }
    }

    private async consumeInvitation(
        transaction: Prisma.TransactionClient,
        input: RegisterUserWithInvitationInput,
    ): Promise<void> {
        const result = await transaction.invitation.updateMany({
            where: {
                id: input.invitationId,
                usedAt: null,
                expiresAt: { gt: input.usedAt },
            },
            data: { usedAt: input.usedAt },
        });

        if (result.count !== 1) {
            throw new InvitationUnavailableError();
        }
    }

    private async createRegisteredUser(
        transaction: Prisma.TransactionClient,
        input: CreateUserWithAccountInput,
    ): Promise<RegisteredUser> {
        const user = await transaction.user.create({
            data: {
                email: input.email,
                passwordHash: input.passwordHash,
            },
        });

        const account = await transaction.account.create({
            data: {
                name: input.accountName,
                userId: user.id,
                integrationConfig: {
                    create: {
                        sendWindowStart: this.parseTime(input.sendWindow.start),
                        sendWindowEnd: this.parseTime(input.sendWindow.end),
                        timeZone: input.sendWindow.timeZone,
                    },
                },
            },
        });

        return { user, account };
    }

    // HH:mm → coluna TIME, gravada como horário UTC de 1970-01-01.
    private parseTime(value: string): Date {
        const [hours, minutes] = value.split(':').map(Number);
        return new Date(Date.UTC(1970, 0, 1, hours, minutes));
    }
}
