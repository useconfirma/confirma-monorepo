export interface User {
    id: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
}

export type UserCredentials = User;

export interface UserAccount {
    id: string;
    name: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface RegisteredUser {
    user: User;
    account: UserAccount;
}
