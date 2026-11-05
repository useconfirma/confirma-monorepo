import type { CSSProperties, ReactNode } from 'react';
import { cn, tv } from '@/shared/lib/tailwind';

/*
 * Ilustração do fluxo principal (docs/specs/overview.md): o sistema integrado
 * cria o agendamento (API-11), o paciente responde pelo WhatsApp e o webhook
 * (API-13) entrega o resultado. Os nós seguem os estados de ENT-05.
 * Dados fictícios, como no Beta.
 *
 * Material: esmalte sobre Noite, com luz vinda de cima. Borda superior mais
 * clara, sombra projetada para baixo e tela da conversa rebaixada.
 */
const surface =
    'overflow-hidden rounded-card border border-branco/8 border-t-branco/16 bg-linear-to-b from-verde-escuro to-noite shadow-[0_20px_40px_-16px_var(--shade),0_6px_12px_-6px_var(--shade),inset_0_1px_0_var(--edge)]';

const bubble = tv({
    base: 'flex max-w-[88%] flex-col gap-1 rounded-lg px-3 py-2 text-xs text-branco shadow-[0_1px_2px_var(--shade),inset_0_1px_0_var(--edge)]',
    variants: {
        from: {
            account: 'self-end rounded-br-xs bg-verde-profundo',
            patient: 'self-start rounded-bl-xs bg-verde',
        },
    },
});

type StepProps = {
    caption: string;
    state: string;
    final?: boolean;
    delay: number;
    children: ReactNode;
};

const Step = ({
    caption,
    state,
    final = false,
    delay,
    children,
}: StepProps) => (
    <li
        className="before:border-verde-acinzentado/70 motion-safe:animate-slide-up relative grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 pb-7 before:absolute before:top-2 before:-bottom-2 before:left-[5.5px] before:border-l before:border-dashed last:pb-0 last:before:hidden motion-safe:[animation-fill-mode:backwards] [@media(max-height:50rem)]:pb-4"
        style={{ animationDelay: `${delay}ms` } as CSSProperties}
    >
        <span
            className={cn(
                'relative mt-0.5 size-3 rounded-full border',
                final
                    ? 'border-menta bg-menta shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-menta)_18%,transparent)]'
                    : 'border-cinza-verde bg-noite',
            )}
        />
        <div className="min-w-0">
            <p className="flex items-baseline justify-between gap-3 text-xs">
                <span className="text-cinza-verde-medio">{caption}</span>
                <span
                    className={cn(
                        'font-mono',
                        final ? 'text-menta' : 'text-cinza-verde',
                    )}
                >
                    {state}
                </span>
            </p>
            <div className="mt-2.5">{children}</div>
        </div>
    </li>
);

type HttpCardProps = {
    target: string;
    status: string;
    children: ReactNode;
};

const HttpCard = ({ target, status, children }: HttpCardProps) => (
    <div className={surface}>
        <div className="border-branco/6 flex items-center justify-between gap-3 border-b px-3.5 py-2.5 font-mono text-xs">
            <span className="text-nevoa truncate">
                <span className="bg-branco/8 text-menta mr-2 rounded-xs px-1.5 py-0.5 font-medium">
                    POST
                </span>
                {target}
            </span>
            <span className="text-menta shrink-0">{status}</span>
        </div>
        <pre className="text-cinza-verde overflow-hidden px-3.5 py-3 text-xs">
            {children}
        </pre>
    </div>
);

const Field = ({ name, value }: { name: string; value: ReactNode }) => (
    <span className="block overflow-hidden text-ellipsis whitespace-pre">
        {'  '}
        <span className="text-cinza-verde-medio">"{name}"</span>:{' '}
        <span className="text-nevoa">{value}</span>
    </span>
);

export const AuthIllustration = () => (
    <ol
        aria-hidden="true"
        className="w-full max-w-[26rem] [--edge:color-mix(in_oklab,var(--color-branco)_10%,transparent)] [--shade:color-mix(in_oklab,var(--color-noite)_40%,black)]"
    >
        <Step caption="Seu sistema cria o agendamento" state="queued" delay={0}>
            <HttpCard target="/appointments" status="202">
                {'{\n'}
                <Field name="externalId" value='"clinic-appointment-123",' />
                <Field name="patientName" value='"Paciente Teste",' />
                <Field name="scheduledAt" value='"2026-11-04T18:00:00-03:00"' />
                {'}'}
            </HttpCard>
        </Step>

        <Step
            caption="O paciente responde no WhatsApp"
            state="sent"
            delay={120}
        >
            <div className={cn(surface, 'p-3')}>
                <div className="flex items-center gap-2.5 px-0.5 pb-3 [@media(max-height:50rem)]:hidden">
                    <span className="bg-verde-profundo text-nevoa grid size-7 place-items-center rounded-full text-xs font-medium shadow-[inset_0_1px_0_var(--edge)]">
                        PT
                    </span>
                    <span className="flex flex-col">
                        <span className="text-nevoa text-xs font-medium">
                            Paciente Teste
                        </span>
                        <span className="text-cinza-verde font-mono text-xs">
                            +55 11 99999-9999
                        </span>
                    </span>
                </div>
                <div className="bg-noite flex flex-col gap-2 rounded-md p-3 shadow-[inset_0_2px_6px_var(--shade),0_1px_0_var(--edge)]">
                    <p className={bubble({ from: 'account' })}>
                        Olá, Paciente Teste. Confirme sua Consulta de teste em
                        04/11 às 18:00, na Unidade de teste. Responda 1 para
                        confirmar ou 2 para recusar.
                        <span className="text-branco/60 self-end">09:00</span>
                    </p>
                    <p className={bubble({ from: 'patient' })}>
                        <span className="flex items-end gap-3">
                            <span className="text-sm font-semibold">1</span>
                            <span className="text-branco/70">09:04</span>
                        </span>
                    </p>
                </div>
            </div>
        </Step>

        <Step
            caption="Seu webhook recebe o resultado"
            state="confirmed"
            final
            delay={240}
        >
            <HttpCard target="clinica.example/webhook" status="200">
                <span className="block truncate [@media(max-height:50rem)]:hidden">
                    X-Confirma-Signature: sha256=9f2c…
                </span>
                {'{\n'}
                <Field name="type" value='"appointment.confirmed",' />
                <Field
                    name="state"
                    value={<span className="text-menta">"confirmed"</span>}
                />
                {'}'}
            </HttpCard>
        </Step>
    </ol>
);
