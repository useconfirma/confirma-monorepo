import type {
    RegisteredUser,
    User,
    UserCredentials,
} from '../models/user.model.js';

export type CreateUserWithAccountInput = {
    email: string;
    passwordHash: string;
    accountName: string;
};

export type RegisterUserWithInvitationInput = {
    invitationId: string;
    email: string;
    passwordHash: string;
    accountName: string;
    usedAt: Date;
};

export interface UserRepository {
    createWithAccount(
        input: CreateUserWithAccountInput,
    ): Promise<RegisteredUser>;
    findByEmail(email: string): Promise<UserCredentials | null>;
    findById(id: string): Promise<User | null>;
    registerWithInvitation(
        input: RegisterUserWithInvitationInput,
    ): Promise<RegisteredUser>;
}
