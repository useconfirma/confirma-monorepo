import { AppError } from '../../../../shared/domain/errors/app-error.js';

export class InvitationTokenConflictError extends AppError {
    constructor() {
        super(
            'INVITATION_TOKEN_CONFLICT',
            'O token do convite já está em uso.',
            409,
        );
    }
}
