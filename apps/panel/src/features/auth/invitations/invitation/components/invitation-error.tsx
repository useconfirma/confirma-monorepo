import { Link } from '@tanstack/react-router';
import { Button } from '@/shared/components/ui/button';

const appear =
    'motion-safe:animate-slide-up motion-safe:[animation-fill-mode:backwards] motion-safe:[animation-duration:400ms]';

/*
 * Erro da rota de convite na folha de conteúdo do AuthLayout. Qualquer falha
 * na verificação do convite cai aqui com a mesma mensagem: o motivo não é
 * exposto. A ação principal leva a um novo pedido de convite e, abaixo, uma
 * bandeja rebaixada leva ao login.
 */
export const InvitationError = () => {
    return (
        <div>
            <header className={appear}>
                <p className="text-danger tracking-caps text-xs font-medium uppercase">
                    Convite indisponível
                </p>
                <h1 className="text-foreground mt-2 text-2xl font-semibold text-balance sm:text-3xl">
                    Este convite não é mais válido
                </h1>
                <p className="text-muted mt-2 text-base text-pretty">
                    O link pode ter expirado, já ter sido usado ou estar
                    incompleto. Peça um novo convite para criar sua conta no
                    Confirma.
                </p>
            </header>

            <div
                className={`${appear} mt-8`}
                style={{ animationDelay: '100ms' }}
            >
                <Button asChild size="lg" className="w-full">
                    <Link to="/request-invitation" replace>
                        Solicitar novo convite
                    </Link>
                </Button>
            </div>

            <aside
                className={`${appear} rounded-card border-border from-nevoa to-branco mt-10 border bg-linear-to-b p-4 shadow-[inset_0_1px_3px_color-mix(in_oklab,var(--color-noite)_8%,transparent)]`}
                style={{ animationDelay: '200ms' }}
            >
                <p className="text-foreground text-sm font-medium">
                    Já criou sua conta?
                </p>
                <p className="text-muted mt-1 text-sm text-pretty">
                    Entre com o e-mail e a senha que você cadastrou.
                </p>
                <Button asChild variant="secondary" size="sm" className="mt-4">
                    <Link to="/sign-in" replace>
                        Entrar
                    </Link>
                </Button>
            </aside>
        </div>
    );
};
