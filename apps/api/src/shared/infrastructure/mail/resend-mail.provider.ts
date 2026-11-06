import { Resend } from 'resend';
import { AppError } from '../../domain/errors/app-error.js';
import type {
    MailProvider,
    SendMailInput,
} from '../../domain/providers/mail-provider.js';

export class ResendMailProvider implements MailProvider {
    private readonly resend: Resend;

    constructor(
        private readonly from: string,
        apiKey: string,
    ) {
        this.resend = new Resend(apiKey);
    }

    async send(input: SendMailInput): Promise<void> {
        try {
            const { error } = await this.resend.emails.send({
                from: this.from,
                to: input.to,
                subject: input.subject,
                text: input.text,
            });

            if (error) {
                throw new AppError(
                    'MAIL_DELIVERY_FAILED',
                    'Não foi possível enviar o e-mail.',
                    503,
                );
            }
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            throw new AppError(
                'MAIL_DELIVERY_FAILED',
                'Não foi possível enviar o e-mail.',
                503,
            );
        }
    }
}
