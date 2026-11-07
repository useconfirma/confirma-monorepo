import { Check, CircleDashed } from 'lucide-react';
import { useId } from 'react';
import type { paths } from '@/shared/@types/api';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card';

type ApiKey =
    paths['/account']['get']['responses'][200]['content']['application/json']['account']['apiKey'];

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long',
    timeStyle: 'short',
});

/*
 * API Key atual da conta (ENT-04), vinda de `account.apiKey`.
 * `configured` só diz que uma chave foi gerada: não indica que ela já foi
 * usada. O valor da chave nunca é retornado por GET /account, então nada
 * dele (nem prefixo ou máscara) é exibido aqui.
 * Componente apresentacional: recebe os dados por props e não busca nem grava.
 * A ação fica desabilitada até a geração (API-08) ser implementada.
 */
export const ApiKeyConfiguration = ({
    apiKey,
    className,
}: {
    apiKey: ApiKey;
    className?: string;
}) => {
    const headingId = useId();
    const actionHeadingId = useId();
    const actionHintId = useId();

    const { configured, createdAt } = apiKey;

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
                                ? 'Esta conta já possui uma API Key.'
                                : 'Nenhuma API Key foi gerada para esta conta. Você vai precisar de uma para autenticar as chamadas do seu sistema à API pública.'}
                        </CardDescription>
                    </header>
                </CardHeader>

                {configured && (
                    <CardContent>
                        <dl className="grid gap-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-x-6 sm:gap-y-3">
                            <div className="min-w-0 space-y-1 sm:contents">
                                <dt className="text-muted text-sm">
                                    Gerada em
                                </dt>
                                <dd className="text-foreground text-sm">
                                    {createdAt ? (
                                        <time dateTime={createdAt}>
                                            {dateFormatter.format(
                                                new Date(createdAt),
                                            )}
                                        </time>
                                    ) : (
                                        <span className="text-subtle">
                                            Não informada
                                        </span>
                                    )}
                                </dd>
                            </div>
                            <div className="min-w-0 space-y-1 sm:contents">
                                <dt className="text-muted text-sm">Valor</dt>
                                <dd className="text-foreground text-sm text-pretty">
                                    Exibido só no momento da geração. Não é
                                    possível recuperá-lo depois.
                                </dd>
                            </div>
                        </dl>
                    </CardContent>
                )}

                <section
                    aria-labelledby={actionHeadingId}
                    className="border-border flex flex-col gap-4 border-t p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-6"
                >
                    <div className="min-w-0 space-y-1">
                        <h3
                            id={actionHeadingId}
                            className="text-foreground text-sm font-semibold"
                        >
                            {configured
                                ? 'Substituir a chave'
                                : 'Gerar a primeira chave'}
                        </h3>
                        <p
                            id={actionHintId}
                            className="text-muted text-sm text-pretty"
                        >
                            {configured
                                ? 'A chave atual deixa de funcionar quando uma nova é gerada. '
                                : ''}
                            A geração ainda não está disponível nesta etapa.
                        </p>
                    </div>

                    <Button
                        variant={configured ? 'secondary' : 'primary'}
                        disabled
                        aria-describedby={actionHintId}
                        className="w-full sm:w-auto"
                    >
                        {configured ? 'Gerar nova API Key' : 'Gerar API Key'}
                    </Button>
                </section>
            </section>
        </Card>
    );
};
