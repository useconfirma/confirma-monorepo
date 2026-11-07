import { Link } from '@tanstack/react-router';
import { Button } from '@/shared/components/ui/button';
import { SignInForm } from '../components/sign-in-form';
import { useSignIn } from '../hooks/use-sign-in.hook';

const appear =
    'motion-safe:animate-slide-up motion-safe:[animation-fill-mode:backwards] motion-safe:[animation-duration:400ms]';

/*
 * Login (UC-03) na folha de conteúdo do AuthLayout. A tela só compõe:
 * cabeçalho, formulário alimentado pelo `useSignIn` e, abaixo, uma bandeja
 * rebaixada que leva ao pedido de convite, já que o Beta é fechado.
 */
const SignInScreen = () => {
    const signIn = useSignIn();

    return (
        <div>
            <header className={appear}>
                <p className="text-brand tracking-caps text-xs font-medium uppercase">
                    Painel da conta
                </p>
                <h1 className="text-foreground mt-2 text-2xl font-semibold text-balance sm:text-3xl">
                    Entrar no Confirma
                </h1>
                <p className="text-muted mt-2 text-base text-pretty">
                    Acesse com o e-mail e a senha cadastrados no seu convite.
                </p>
            </header>

            <div
                className={`${appear} mt-8`}
                style={{ animationDelay: '100ms' }}
            >
                <SignInForm {...signIn} />
            </div>

            <aside
                className={`${appear} rounded-card border-border from-nevoa to-branco mt-10 border bg-linear-to-b p-4 shadow-[inset_0_1px_3px_color-mix(in_oklab,var(--color-noite)_8%,transparent)]`}
                style={{ animationDelay: '200ms' }}
            >
                <p className="text-foreground text-sm font-medium">
                    Ainda não tem acesso?
                </p>
                <p className="text-muted mt-1 text-sm text-pretty">
                    O Confirma está em Beta fechado. Peça um convite para criar
                    sua conta.
                </p>
                <Button asChild variant="secondary" size="sm" className="mt-4">
                    <Link to="/request-invitation">Solicitar convite</Link>
                </Button>
            </aside>
        </div>
    );
};

export default SignInScreen;
