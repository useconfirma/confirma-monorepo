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
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';

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
        <Card asChild>
            <section aria-labelledby={headingId}>
                <CardHeader asChild className="gap-4">
                    <header>
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                            <div className="min-w-0 space-y-1">
                                <CardTitle id={headingId}>
                                    Configuração da conta
                                </CardTitle>
                                <CardDescription>
                                    Acompanhe as integrações necessárias para
                                    utilizar o Confirma.
                                </CardDescription>
                            </div>
                            <p className="text-foreground shrink-0 text-sm font-medium">
                                {summary}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Progress
                                value={done}
                                max={total}
                                aria-label="Progresso da configuração da conta"
                                getValueLabel={() => `${summary}, ${percent}%`}
                                className="flex-1"
                            />
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
                </CardHeader>

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
                                                <Badge
                                                    variant={
                                                        configured
                                                            ? 'success'
                                                            : 'neutral'
                                                    }
                                                >
                                                    {configured ? (
                                                        <Check aria-hidden="true" />
                                                    ) : (
                                                        <CircleDashed aria-hidden="true" />
                                                    )}
                                                    {configured
                                                        ? 'Configurado'
                                                        : 'Pendente'}
                                                </Badge>
                                            </div>
                                            <p className="text-muted text-sm text-pretty">
                                                {description}
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        asChild
                                        size="sm"
                                        variant={
                                            configured ? 'secondary' : 'primary'
                                        }
                                        className="w-full sm:w-auto"
                                    >
                                        <Link
                                            to={to}
                                            aria-label={`${configured ? 'Gerenciar' : 'Configurar'} ${name}`}
                                        >
                                            {configured
                                                ? 'Gerenciar'
                                                : 'Configurar'}
                                        </Link>
                                    </Button>
                                </li>
                            );
                        },
                    )}
                </ul>
            </section>
        </Card>
    );
};
