export type SendMailInput = {
    to: string;
    subject: string;
    text: string;
};

export interface MailProvider {
    send(input: SendMailInput): Promise<void>;
}
