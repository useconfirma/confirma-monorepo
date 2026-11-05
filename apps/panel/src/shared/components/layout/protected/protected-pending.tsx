/*
 * Estado pendente da área protegida (verificação de sessão e dados da
 * Account), exibido pelo TanStack Router (`pendingComponent`). Usa só a
 * moldura Névoa com uma folha, comum a todas as páginas protegidas. É
 * puramente visual: não lê dados, sessão nem rota.
 */
export const ProtectedPending = () => (
    <div className="bg-background p-frame flex h-dvh">
        <div
            role="status"
            aria-live="polite"
            className="rounded-sheet bg-surface flex min-w-0 flex-1 items-center justify-center px-5"
        >
            <span className="sr-only">Carregando o painel…</span>
            {/* A pulsação só roda sem preferência por menos movimento. */}
            <img
                src="/confirma-logo-verde.svg"
                alt=""
                aria-hidden="true"
                width={104}
                height={40}
                className="h-10 w-auto motion-safe:animate-pulse"
            />
        </div>
    </div>
);
