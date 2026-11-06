import { AppError } from '../../../../shared/domain/errors/app-error.js';

export class EmailAlreadyRegisteredError extends AppError {
    constructor() {
        super('EMAIL_ALREADY_REGISTERED', 'E-mail já cadastrado.', 409);
    }
}
