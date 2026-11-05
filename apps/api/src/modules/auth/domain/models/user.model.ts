export interface User {
    id: string;
    email: string;
}

export interface UserCredentials extends User {
    passwordHash: string;
}

export interface UserAccount {
    id: string;
    name: string;
}

export interface RegisteredUser {
    user: User;
    account: UserAccount;
}
