import { requestInvitation } from '../api/request-invitation.api';

const successMessage =
    'Se o endereço estiver elegível, você receberá o convite por e-mail.';
const errorMessage = 'Não foi possível enviar a solicitação. Tente novamente.';

export const setupRequestInvitationForm = () => {
    const forms = document.querySelectorAll<HTMLFormElement>(
        '[data-request-invitation-form]',
    );

    forms.forEach((form) => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const email = new FormData(form).get('email');
            const submit = form.querySelector<HTMLButtonElement>(
                'button[type="submit"]',
            );
            const status =
                form.querySelector<HTMLElement>('[data-form-status]');

            if (typeof email !== 'string' || !email.trim()) return;

            if (submit) submit.disabled = true;
            if (status) status.textContent = 'Enviando solicitação…';

            try {
                await requestInvitation(email.trim());
                form.reset();
                if (status) status.textContent = successMessage;
            } catch {
                if (status) status.textContent = errorMessage;
            } finally {
                if (submit) submit.disabled = false;
            }
        });
    });
};
