import { Link } from '@tanstack/react-router';
import { WelcomeIllustration } from '../components/welcome-illustration';

const appear =
    'motion-safe:animate-slide-up motion-safe:[animation-fill-mode:backwards] motion-safe:[animation-duration:400ms]';

/*
 * Conclusão do cadastro: moldura Névoa com uma única folha e o
 * conteúdo centralizado. Entrada em sequência: ilustração, título, texto e
 * ação.
 */
const WelcomeScreen = () => (
    <div className="bg-background p-frame flex min-h-dvh">
        <main className="rounded-sheet bg-surface flex min-w-0 flex-1 flex-col items-center justify-center px-5 py-10 sm:px-12 sm:py-14">
            <WelcomeIllustration />

            <div className="mt-10 flex w-full max-w-lg flex-col items-center text-center">
                <h1
                    className={`${appear} text-foreground text-2xl font-semibold text-balance sm:text-3xl`}
                    style={{ animationDelay: '350ms' }}
                >
                    Tudo pronto para começar!
                </h1>
                <p
                    className={`${appear} text-muted mt-3 max-w-md text-base text-pretty`}
                    style={{ animationDelay: '450ms' }}
                >
                    Sua conta no Confirma foi criada. Agora você pode configurar
                    suas integrações e começar a confirmar agendamentos pelo
                    WhatsApp diretamente da sua aplicação.
                </p>
                <Link
                    to="/overview"
                    className={`${appear} rounded-control from-verde-escuro to-noite text-primary-foreground border-branco/10 border-t-branco/20 hover:from-verde-profundo hover:to-verde-escuro active:from-noite active:to-noite mt-7 inline-flex h-11 w-full items-center justify-center border bg-linear-to-b px-6 text-sm font-medium shadow-[0_8px_16px_-8px_color-mix(in_oklab,var(--color-noite)_60%,transparent),inset_0_1px_0_color-mix(in_oklab,var(--color-branco)_14%,transparent)] transition-[translate,box-shadow,--tw-gradient-from,--tw-gradient-to] duration-200 active:translate-y-px active:shadow-[inset_0_2px_4px_color-mix(in_oklab,var(--color-noite)_70%,black)] sm:w-auto`}
                    style={{ animationDelay: '550ms' }}
                >
                    Acessar meu painel
                </Link>
            </div>
        </main>
    </div>
);

export default WelcomeScreen;
