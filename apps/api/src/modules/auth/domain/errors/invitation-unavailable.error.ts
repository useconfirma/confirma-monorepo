import { AppError } from '../../../../shared/domain/errors/app-error.js';

export class InvitationUnavailableError extends AppError {
    constructor() {
        super('INVITATION_UNAVAILABLE', 'Convite indisponível.', 410);
    }
}
