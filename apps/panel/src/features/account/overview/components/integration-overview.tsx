import { Link } from '@tanstack/react-router';
import {
    Check,
    CircleDashed,
    Clock,
    KeyRound,
    MessageCircle,
    Webhook,
    type LucideIcon,
} from 'lucide-react';
import { useId } from 'react';
import type { paths } from '@/shared/@types/api';
import type { FileRouteTypes } from '@/routeTree.gen';
import { cn } from '@/shared/lib/tailwind';

type Account =
    paths['/account']['get']['responses'][200]['content']['application/json']['account'];

type IntegrationKey = 'apiKey' | 'zApi' | 'webhook' | 'sendWindow';

interface IntegrationDefinition {
    key: IntegrationKey;
    name: string;
    description: string;
    to: FileRouteTypes['to'];
    icon: LucideIcon;
}

const integrations: IntegrationDefinition[] = [
    {
        key: 'apiKey',
        name: 'API Key',
        description: 'Autentica as chamadas do seu sistema ao Confirma.',
        to: '/api-key',
        icon: KeyRound,
    },
    {
        key: 'zApi',
        name: 'WhatsApp (Z-API)',
        description: 'Conecta a instância usada para enviar as mensagens.',
        to: '/integrations',
        icon: MessageCircle,
    },
    {
        key: 'webhook',
        name: 'Webhook',
        description: 'Recebe na sua aplicação o resultado de cada confirmação.',
        to: '/webhook',
        icon: Webhook,
    },
    {
        key: 'sendWindow',
        name: 'Janela de envio',
        description:
            'Define os horários em que as mensagens podem ser enviadas.',
        to: '/send-window',
        icon: Clock,
    },
];

const actionBase =
    'rounded-control inline-flex h-9 w-full shrink-0 items-center justify-center border px-4 text-sm font-medium transition-[translate,box-shadow,color,background-image] duration-200 active:translate-y-px sm:w-auto';

const primaryAction =
    'from-verde-escuro to-noite text-primary-foreground border-branco/10 border-t-branco/20 hover:from-verde-profundo hover:to-verde-escuro active:from-noite active:to-noite bg-linear-to-b shadow-[0_4px_8px_-4px_color-mix(in_oklab,var(--color-noite)_60%,transparent),inset_0_1px_0_color-mix(in_oklab,var(--color-branco)_14%,transparent)] active:shadow-[inset_0_2px_4px_color-mix(in_oklab,var(--color-noite)_70%,black)]';

const secondaryAction =
    'border-border from-branco to-nevoa text-secondary-foreground bg-linear-to-b shadow-[0_1px_2px_color-mix(in_oklab,var(--color-noite)_8%,transparent),inset_0_1px_0_var(--color-branco)] hover:to-verde-claro active:shadow-[inset_0_1px_3px_color-mix(in_oklab,var(--color-noite)_14%,transparent)]';

/*
 * Estado de configuração da Account (ENT-03). `configured` só diz que a
 * integração foi cadastrada: não garante que esteja operacional ou testada.
 * Componente apresentacional: recebe a Account por props e não busca dados.
 */
export const IntegrationOverview = ({ account }: { account: Account }) => {
    const headingId = useId();

    const total = integrations.length;
    
    const done = integrations.filter(
        ({ key }) => account[key].configured,
    ).length;
    const percent = Math.round((done / total) * 100);
    const summary = `${done} de ${total} configurações`;

    return (
        <section
            aria-labelledby={headingId}
            className="rounded-card border-border bg-surface border"
        >
            <header className="space-y-4 p-4 sm:p-6">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                    <div className="min-w-0 space-y-1">
                        <h2
                            id={headingId}
                            className="text-foreground text-lg font-semibold text-balance"
                        >
                            Configuração da conta
                        </h2>
                        <p className="text-muted text-sm text-pretty">
                            Acompanhe as integrações necessárias para utilizar o
                            Confirma.
                        </p>
                    </div>
                    <p className="text-foreground shrink-0 text-sm font-medium">
                        {summary}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div
                        role="progressbar"
                        aria-label="Progresso da configuração da conta"
                        aria-valuemin={0}
                        aria-valuemax={total}
                        aria-valuenow={done}
                        aria-valuetext={`${summary}, ${percent}%`}
                        className="bg-cinza-verde-claro h-2 min-w-0 flex-1 overflow-hidden rounded-full shadow-[inset_0_1px_2px_color-mix(in_oklab,var(--color-noite)_18%,transparent)]"
                    >
                        <div
                            className="from-menta to-verde h-full rounded-full bg-linear-to-b shadow-[inset_0_1px_0_color-mix(in_oklab,var(--color-branco)_35%,transparent)] transition-[width] duration-200"
                            style={{ width: `${percent}%` }}
                        />
                    </div>
                    <span
                        aria-hidden="true"
                        className="text-muted w-10 shrink-0 text-right font-mono text-xs"
                    >
                        {percent}%
                    </span>
                </div>

                {done === total && (
                    <p className="text-success text-sm font-medium">
                        A configuração da conta está completa.
                    </p>
                )}
            </header>

            <ul className="border-border divide-border divide-y border-t">
                {integrations.map(
                    ({ key, name, description, to, icon: Icon }) => {
                        const configured = account[key].configured;

                        return (
                            <li
                                key={key}
                                className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5 sm:px-6"
                            >
                                <div className="flex min-w-0 flex-1 items-start gap-3">
                                    <span
                                        aria-hidden="true"
                                        className="rounded-control border-border from-branco to-nevoa text-muted flex size-10 shrink-0 items-center justify-center border bg-linear-to-b shadow-[0_1px_2px_color-mix(in_oklab,var(--color-noite)_8%,transparent),inset_0_1px_0_var(--color-branco)]"
                                    >
                                        <Icon className="size-5" />
                                    </span>

                                    <div className="min-w-0 space-y-1">
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                            <h3 className="text-foreground text-sm font-semibold">
                                                {name}
                                            </h3>
                                            <span
                                                className={cn(
                                                    'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium',
                                                    configured
                                                        ? 'bg-success-soft text-success border-success/20'
                                                        : 'text-muted border-border-strong border-dashed',
                                                )}
                                            >
                                                {configured ? (
                                                    <Check
                                                        aria-hidden="true"
                                                        className="size-3.5"
                                                    />
                                                ) : (
                                                    <CircleDashed
                                                        aria-hidden="true"
                                                        className="size-3.5"
                                                    />
                                                )}
                                                {configured
                                                    ? 'Configurado'
                                                    : 'Pendente'}
                                            </span>
                                        </div>
                                        <p className="text-muted text-sm text-pretty">
                                            {description}
                                        </p>
                                    </div>
                                </div>

                                <Link
                                    to={to}
                                    aria-label={`${configured ? 'Gerenciar' : 'Configurar'} ${name}`}
                                    className={cn(
                                        actionBase,
                                        configured
                                            ? secondaryAction
                                            : primaryAction,
                                    )}
                                >
                                    {configured ? 'Gerenciar' : 'Configurar'}
                                </Link>
                            </li>
                        );
                    },
                )}
            </ul>
        </section>
    );
};
