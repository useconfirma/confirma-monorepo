import { Check, CircleDashed } from 'lucide-react';
import { useId } from 'react';
import type { paths } from '@/shared/@types/api';
import { Badge } from '@/shared/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

type Webhook =
    paths['/account']['get']['responses'][200]['content']['application/json']['account']['webhook'];

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long',
    timeStyle: 'short',
});

/*
 * Configuração atual do webhook (ENT-03), vinda de `account.webhook`.
 * `configured` só diz que o webhook foi cadastrado: não garante que esteja
 * operacional ou testado. O segredo de assinatura nunca é retornado pela API.
 * Componente apresentacional: recebe os dados por props e não busca nem grava.
 * Os campos ficam desabilitados até a configuração (API-09) ser implementada.
 */
export const WebhookConfiguration = ({
    webhook,
    className,
}: {
    webhook: Webhook;
    className?: string;
}) => {
    const headingId = useId();
    const formHeadingId = useId();
    const urlId = useId();
    const urlHintId = useId();
    const secretId = useId();
    const secretHintId = useId();

    const { configured, url, updatedAt } = webhook;

    return (
        <Card asChild className={className}>
            <section aria-labelledby={headingId}>
                <CardHeader asChild>
                    <header>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <CardTitle id={headingId}>
                                Configuração atual
                            </CardTitle>
                            <Badge variant={configured ? 'success' : 'neutral'}>
                                {configured ? (
                                    <Check aria-hidden="true" />
                                ) : (
                                    <CircleDashed aria-hidden="true" />
                                )}
                                {configured ? 'Configurado' : 'Pendente'}
                            </Badge>
                        </div>
                        <CardDescription>
                            {configured
                                ? 'Endereço que recebe os eventos dos seus agendamentos.'
                                : 'Ainda não existe uma configuração de webhook para esta conta.'}
                        </CardDescription>
                    </header>
                </CardHeader>

                {configured && (
                    <CardContent>
                        <dl className="grid gap-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-x-6 sm:gap-y-3">
                            <div className="min-w-0 space-y-1 sm:contents">
                                <dt className="text-muted text-sm">URL</dt>
                                <dd className="text-foreground font-mono text-sm break-all">
                                    {url ?? (
                                        <span className="text-subtle font-sans">
                                            Não informada
                                        </span>
                                    )}
                                </dd>
                            </div>
                            <div className="min-w-0 space-y-1 sm:contents">
                                <dt className="text-muted text-sm">
                                    Última atualização
                                </dt>
                                <dd className="text-foreground text-sm">
                                    {updatedAt ? (
                                        <time dateTime={updatedAt}>
                                            {dateFormatter.format(
                                                new Date(updatedAt),
                                            )}
                                        </time>
                                    ) : (
                                        <span className="text-subtle">
                                            Não informada
                                        </span>
                                    )}
                                </dd>
                            </div>
                        </dl>
                    </CardContent>
                )}

                <section
                    aria-labelledby={formHeadingId}
                    className="border-border space-y-4 border-t p-4 sm:p-6"
                >
                    <div className="space-y-1">
                        <h3
                            id={formHeadingId}
                            className="text-foreground text-sm font-semibold"
                        >
                            {configured
                                ? 'Alterar configuração'
                                : 'Configurar webhook'}
                        </h3>
                        <p className="text-muted text-sm text-pretty">
                            A edição ainda não está disponível nesta etapa.
                        </p>
                    </div>

                    <fieldset disabled className="space-y-4">
                        <legend className="sr-only">
                            Campos da configuração do webhook (indisponíveis)
                        </legend>

                        <div className="space-y-2">
                            <Label htmlFor={urlId}>URL HTTPS</Label>
                            <Input
                                id={urlId}
                                type="url"
                                inputMode="url"
                                placeholder="https://"
                                autoComplete="off"
                                aria-describedby={urlHintId}
                                className="font-mono"
                            />
                            <p id={urlHintId} className="text-subtle text-xs">
                                Endpoint da sua aplicação que receberá os
                                eventos. Precisa usar HTTPS.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={secretId}>
                                Segredo de assinatura
                            </Label>
                            <Input
                                id={secretId}
                                type="password"
                                autoComplete="off"
                                aria-describedby={secretHintId}
                                className="font-mono"
                            />
                            <p
                                id={secretHintId}
                                className="text-subtle text-xs"
                            >
                                Usado para assinar cada entrega. Depois de
                                salvo, não é exibido novamente.
                            </p>
                        </div>
                    </fieldset>
                </section>
            </section>
        </Card>
    );
};
