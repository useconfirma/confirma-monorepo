import { MailCheck } from 'lucide-react';

interface InvitationEmailProps {
    /** E-mail autorizado pelo convite (API-14); é o e-mail de acesso da conta. */
    email: string;
}

/*
 * Cartão em relevo com o e-mail do convite, ao contrário da bandeja rebaixada
 * do rodapé da tela. Só leitura: o e-mail não é editável no aceite e será o
 * usado para entrar no Confirma. O selo Verde marca o convite como confirmado.
 */
export const InvitationEmail = ({ email }: InvitationEmailProps) => (
    <div className="rounded-card border-border bg-surface flex items-center gap-3.5 border p-3.5 shadow-[0_1px_2px_color-mix(in_oklab,var(--color-noite)_8%,transparent),0_6px_16px_-10px_color-mix(in_oklab,var(--color-noite)_24%,transparent)]">
        <span
            aria-hidden="true"
            className="bg-brand-soft text-brand border-brand/15 grid size-10 shrink-0 place-items-center rounded-full border shadow-[inset_0_1px_0_var(--color-branco)]"
        >
            <MailCheck size={18} strokeWidth={1.75} />
        </span>

        <div className="min-w-0 flex-1">
            <p className="text-subtle text-xs">Convite para</p>
            <p className="text-foreground truncate text-sm font-medium">
                {email}
            </p>
        </div>

        <span className="bg-brand-soft text-brand shrink-0 rounded-full px-2.5 py-1 text-xs font-medium">
            Confirmado
        </span>
    </div>
);
