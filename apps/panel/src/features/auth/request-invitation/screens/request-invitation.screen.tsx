import { Link } from '@tanstack/react-router';
import { Button } from '@/shared/components/ui/button';
import { RequestInvitationForm } from '../components/request-invitation-form';
import { useRequestInvitation } from '../hooks/use-request-invitation.hook';

const appear =
    'motion-safe:animate-slide-up motion-safe:[animation-fill-mode:backwards] motion-safe:[animation-duration:400ms]';

/*
 * Pedido de convite (UC-01) na folha de conteúdo do AuthLayout. A tela só
 * compõe: cabeçalho, formulário alimentado pelo `useRequestInvitation` e,
 * abaixo, uma bandeja rebaixada que leva ao login.
 */
const RequestInvitationScreen = () => {
    const requestInvitation = useRequestInvitation();

    return (
        <div>
            <header className={appear}>
                <p className="text-brand tracking-caps text-xs font-medium uppercase">
                    Beta fechado
                </p>
                <h1 className="text-foreground mt-2 text-2xl font-semibold text-balance sm:text-3xl">
                    Solicitar convite
                </h1>
                <p className="text-muted mt-2 text-base text-pretty">
                    Informe seu e-mail e enviaremos um link para criar sua conta
                    no Confirma.
                </p>
            </header>

            <div
                className={`${appear} mt-8`}
                style={{ animationDelay: '100ms' }}
            >
                <RequestInvitationForm {...requestInvitation} />
            </div>

            <aside
                className={`${appear} rounded-card border-border from-nevoa to-branco mt-10 border bg-linear-to-b p-4 shadow-[inset_0_1px_3px_color-mix(in_oklab,var(--color-noite)_8%,transparent)]`}
                style={{ animationDelay: '200ms' }}
            >
                <p className="text-foreground text-sm font-medium">
                    Já tem uma conta?
                </p>
                <p className="text-muted mt-1 text-sm text-pretty">
                    Entre com o e-mail e a senha que você cadastrou.
                </p>
                <Button asChild variant="secondary" size="sm" className="mt-4">
                    <Link to="/sign-in">Entrar</Link>
                </Button>
            </aside>
        </div>
    );
};

export default RequestInvitationScreen;
