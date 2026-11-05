import { Outlet } from '@tanstack/react-router';
import { AuthIllustration } from './auth-illustration';

/*
 * Moldura Névoa com duas folhas: conteúdo da página à esquerda e identidade
 * sobre Noite à direita. Abaixo de md a folha Noite sai e o logo passa para o
 * topo do conteúdo.
 */
export const AuthLayout = () => (
    <div className="gap-frame bg-background p-frame grid min-h-dvh md:grid-cols-2 xl:grid-cols-[minmax(0,6fr)_minmax(0,7fr)]">
        <main className="rounded-sheet bg-surface flex min-w-0 flex-col items-center justify-center px-5 py-12 sm:px-12">
            <div className="w-full max-w-sm">
                <img
                    src="/confirma-logo-verde.svg"
                    alt="Confirma"
                    width={104}
                    height={40}
                    className="mb-10 h-10 w-auto md:hidden"
                />
                <Outlet />
            </div>
        </main>

        <aside className="rounded-sheet bg-noite relative hidden flex-col overflow-hidden p-8 md:flex lg:px-12 lg:py-10">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,var(--color-verde-profundo)_1px,transparent_1.5px)] mask-radial-from-20% mask-radial-to-80% bg-size-[22px_22px] opacity-70"
            />
            <img
                src="/confirma-logo-branco.svg"
                alt="Confirma"
                width={104}
                height={40}
                className="relative h-10 w-auto self-start"
            />
            <div className="relative flex flex-1 items-center justify-center py-10 [@media(max-height:50rem)]:py-3">
                <AuthIllustration />
            </div>
            <p className="text-cinza-verde-medio relative max-w-xs text-sm [@media(max-height:50rem)]:hidden">
                Confirmação de agendamentos pelo WhatsApp, integrada ao seu
                sistema por API.
            </p>
        </aside>
    </div>
);
