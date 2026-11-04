import type { RegisteredUser } from '../models/user.model.js';

export type RegisterUserWithInvitationInput = {
  invitationId: string;
  email: string;
  passwordHash: string;
  accountName: string;
  usedAt: Date;
};

export interface RegistrationRepository {
  registerWithInvitation(input: RegisterUserWithInvitationInput): Promise<RegisteredUser>;
}
