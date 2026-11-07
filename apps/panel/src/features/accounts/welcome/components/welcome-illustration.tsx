import type { CSSProperties } from 'react';

/*
 * Conversa do fluxo principal (docs/specs/overview.md): o sistema cria o
 * agendamento, o Confirma envia a mensagem fixa (BR-12), o paciente responde
 * exatamente "1" (BR-17) e o agendamento fica confirmed (ENT-05). Dados
 * fictícios.
 *
 * Balões em relevo suave, com luz vinda de cima: borda superior mais clara e
 * sombra projetada para baixo em tom de Noite.
 *
 * Sequência: chamada da API → mensagem → resposta → confirmed.
 */
const enter = (delay: number, duration = 280): CSSProperties => ({
    animationDelay: `${delay}ms`,
    animationDuration: `${duration}ms`,
});

const appear =
    'motion-safe:animate-slide-up motion-safe:[animation-fill-mode:backwards]';
const pop =
    'motion-safe:animate-scale-in motion-safe:[animation-fill-mode:backwards]';

const raised =
    'border border-branco shadow-[0_14px_28px_-14px_var(--shade),0_4px_8px_-4px_var(--shade),inset_0_-1px_0_color-mix(in_oklab,var(--color-noite)_6%,transparent)]';

const connector = 'h-5 border-l border-dashed border-border-strong';

const DoubleCheck = () => (
    <svg
        viewBox="0 0 16 10"
        className="text-verde h-2.5 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M1 5.5 4 8.5 10.5 1.5" />
        <path d="M7 8.5 7.6 8.5 14.5 1.5" />
    </svg>
);

export const WelcomeIllustration = () => (
    <div
        aria-hidden="true"
        className="relative flex w-full justify-center [--shade:color-mix(in_oklab,var(--color-noite)_22%,transparent)]"
    >
        {/* Malha de fundo */}
        <div className="pointer-events-none absolute inset-x-0 -inset-y-6 mx-auto max-w-xl bg-[radial-gradient(circle,var(--color-cinza-verde-claro)_1px,transparent_1.5px)] mask-radial-from-10% mask-radial-to-70% bg-size-[22px_22px]" />

        <div className="relative flex w-full max-w-sm flex-col">
            {/* Seu sistema cria o agendamento */}
            <div
                className={`${appear} ml-9.5 flex flex-col items-start`}
                style={enter(0, 300)}
            >
                <span className="border-border bg-surface text-muted rounded-control border px-2 py-1 font-mono text-xs whitespace-nowrap shadow-xs">
                    <span className="text-brand mr-1.5 font-medium">POST</span>
                    /appointments
                </span>
                <span className={`${connector} ml-5`} />
            </div>

            {/* O Confirma envia a mensagem */}
            <div
                className={`${pop} flex origin-top-left items-end gap-2.5`}
                style={enter(300)}
            >
                <img
                    src="/favicon.svg"
                    alt=""
                    width={28}
                    height={28}
                    className="size-7 shrink-0 rounded-full shadow-sm"
                />
                <p
                    className={`${raised} bg-surface text-foreground max-w-[19rem] rounded-xl rounded-bl-xs px-3.5 py-2.5 text-left text-sm`}
                >
                    <span className="text-brand block text-xs font-medium">
                        Confirma
                    </span>
                    Olá, Paciente Teste. Confirme sua consulta em 12/11 às
                    14:30. Responda <strong>1</strong> para confirmar ou{' '}
                    <strong>2</strong> para recusar.
                    <span className="text-subtle mt-1 block text-right text-xs">
                        09:00
                    </span>
                </p>
            </div>

            {/* O paciente responde */}
            <p
                className={`${pop} ${raised} bg-verde-claro text-foreground mt-3 flex origin-top-right items-end gap-2.5 self-end rounded-xl rounded-br-xs px-3.5 py-2`}
                style={enter(700)}
            >
                <span className="text-base font-semibold">1</span>
                <span className="text-subtle flex items-center gap-1 text-xs">
                    09:04
                    <DoubleCheck />
                </span>
            </p>

            {/* O agendamento fica confirmed */}
            <div
                className={`${appear} flex flex-col items-end pr-6`}
                style={enter(1050, 300)}
            >
                <span className={connector} />
                <span className="bg-noite text-nevoa border-branco/10 border-t-branco/20 -mr-6 flex items-center gap-2 rounded-full border py-1.5 pr-3 pl-1.5 font-mono text-xs whitespace-nowrap shadow-[0_10px_20px_-8px_var(--shade),inset_0_1px_0_color-mix(in_oklab,var(--color-branco)_14%,transparent)]">
                    <span className="bg-menta text-noite grid size-5 place-items-center rounded-full">
                        <svg
                            viewBox="0 0 12 12"
                            className="size-3"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M2.5 6.5 5 9l4.5-6" />
                        </svg>
                    </span>
                    confirmed
                </span>
            </div>
        </div>
    </div>
);
