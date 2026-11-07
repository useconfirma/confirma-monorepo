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

type ZApi =
    paths['/account']['get']['responses'][200]['content']['application/json']['account']['zApi'];

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long',
    timeStyle: 'short',
});

/*
 * Configuração atual da Z-API (ENT-03), vinda de `account.zApi`.
 * `configured` só diz que as credenciais foram cadastradas: a API não informa
 * se a instância está conectada ao WhatsApp. Os tokens nunca são retornados.
 * Componente apresentacional: recebe os dados por props e não busca nem grava.
 * Os campos ficam desabilitados até a configuração (API-10) ser implementada.
 */
export const ZApiConfiguration = ({
    zApi,
    className,
}: {
    zApi: ZApi;
    className?: string;
}) => {
    const headingId = useId();
    const formHeadingId = useId();
    const instanceIdId = useId();
    const instanceTokenId = useId();
    const tokenHintId = useId();
    const clientTokenId = useId();

    const { configured, instanceId, updatedAt } = zApi;

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
                                ? 'As credenciais da instância foram cadastradas. Isso não indica que a instância esteja conectada ao WhatsApp.'
                                : 'A integração com a Z-API ainda não foi configurada para esta conta.'}
                        </CardDescription>
                    </header>
                </CardHeader>

                {configured && (
                    <CardContent>
                        <dl className="grid gap-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-x-6 sm:gap-y-3">
                            <div className="min-w-0 space-y-1 sm:contents">
                                <dt className="text-muted text-sm">
                                    ID da instância
                                </dt>
                                <dd className="text-foreground font-mono text-sm break-all">
                                    {instanceId ?? (
                                        <span className="text-subtle font-sans">
                                            Não informado
                                        </span>
                                    )}
                                </dd>
                            </div>
                            <div className="min-w-0 space-y-1 sm:contents">
                                <dt className="text-muted text-sm">Tokens</dt>
                                <dd className="text-foreground text-sm">
                                    Cadastrados. Por segurança, não são
                                    exibidos.
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
                                ? 'Alterar credenciais'
                                : 'Configurar Z-API'}
                        </h3>
                        <p className="text-muted text-sm text-pretty">
                            A edição ainda não está disponível nesta etapa.
                        </p>
                    </div>

                    <fieldset disabled className="space-y-4">
                        <legend className="sr-only">
                            Credenciais da instância Z-API (indisponíveis)
                        </legend>

                        <div className="space-y-2">
                            <Label htmlFor={instanceIdId}>
                                ID da instância
                            </Label>
                            <Input
                                id={instanceIdId}
                                defaultValue={instanceId ?? undefined}
                                placeholder="Cole o ID da instância"
                                autoComplete="off"
                                spellCheck={false}
                                className="font-mono"
                            />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="min-w-0 space-y-2">
                                <Label htmlFor={instanceTokenId}>
                                    Token da instância
                                </Label>
                                <Input
                                    id={instanceTokenId}
                                    type="password"
                                    placeholder="Cole o token da instância"
                                    autoComplete="off"
                                    aria-describedby={tokenHintId}
                                    className="font-mono"
                                />
                            </div>

                            <div className="min-w-0 space-y-2">
                                <Label htmlFor={clientTokenId}>
                                    Client-Token
                                </Label>
                                <Input
                                    id={clientTokenId}
                                    type="password"
                                    placeholder="Cole o Client-Token"
                                    autoComplete="off"
                                    aria-describedby={tokenHintId}
                                    className="font-mono"
                                />
                            </div>
                        </div>

                        <p id={tokenHintId} className="text-subtle text-xs">
                            Os dois tokens são obrigatórios e, depois de salvos,
                            não são exibidos novamente.
                        </p>
                    </fieldset>
                </section>
            </section>
        </Card>
    );
};
