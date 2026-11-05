import { Link } from '@tanstack/react-router';
import { Button } from '@/shared/components/ui/button';
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
                <Button
                    asChild
                    size="lg"
                    className={`${appear} mt-7 w-full sm:w-auto`}
                    style={{ animationDelay: '550ms' }}
                >
                    <Link to="/overview">Acessar meu painel</Link>
                </Button>
            </div>
        </main>
    </div>
);

export default WelcomeScreen;
