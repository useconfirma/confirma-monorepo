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

export interface UserRepository {
    createWithAccount(
        input: CreateUserWithAccountInput,
    ): Promise<RegisteredUser>;
    findByEmail(email: string): Promise<UserCredentials | null>;
    findById(id: string): Promise<User | null>;
}
