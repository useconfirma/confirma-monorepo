import { Check, CircleDashed, LoaderCircle } from 'lucide-react';
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
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import type { useConfigureZApi } from '../hooks/use-configure-z-api.hook';

type ZApi =
    paths['/account']['get']['responses'][200]['content']['application/json']['account']['zApi'];

type ZApiConfigurationProps = ReturnType<typeof useConfigureZApi> & {
    zApi: ZApi;
    className?: string;
};

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long',
    timeStyle: 'short',
});

// Liga o campo às dicas e, quando houver, à mensagem de erro.
const describedBy = (hintIds: string, errorId: string, hasError: boolean) =>
    hasError ? `${hintIds} ${errorId}` : hintIds;

/*
 * Configuração atual da Z-API (ENT-03), vinda de `account.zApi`, e a
 * configuração (API-10), com estado e ações do `useConfigureZApi` recebidos
 * por props. `configured` só diz que as credenciais foram cadastradas: a API
 * não informa se a instância está conectada ao WhatsApp. Os tokens nunca são
 * retornados, por isso são pedidos de novo a cada salvamento.
 */
export const ZApiConfiguration = ({
    zApi,
    className,
    register,
    errors,
    isPending,
    handleSubmit,
}: ZApiConfigurationProps) => {
    const headingId = useId();
    const formHeadingId = useId();
    const formHintId = useId();
    const instanceIdId = useId();
    const instanceIdErrorId = useId();
    const instanceTokenId = useId();
    const instanceTokenErrorId = useId();
    const clientTokenId = useId();
    const clientTokenErrorId = useId();
    const tokenHintId = useId();

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
                        <p
                            id={formHintId}
                            className="text-muted text-sm text-pretty"
                        >
                            {configured
                                ? 'As novas credenciais substituem as atuais. Ao salvar, o Confirma registra novamente o endereço de callback na sua instância.'
                                : 'Ao salvar, o Confirma valida as credenciais e registra o endereço de callback na sua instância Z-API.'}
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        noValidate
                        aria-busy={isPending}
                        aria-labelledby={formHeadingId}
                        className="space-y-4"
                    >
                        <div className="space-y-2">
                            <Label htmlFor={instanceIdId}>
                                ID da instância
                            </Label>
                            <Input
                                id={instanceIdId}
                                placeholder="Cole o ID da instância"
                                autoComplete="off"
                                autoCapitalize="none"
                                spellCheck={false}
                                disabled={isPending}
                                aria-invalid={
                                    errors.instanceId ? true : undefined
                                }
                                aria-describedby={
                                    errors.instanceId
                                        ? instanceIdErrorId
                                        : undefined
                                }
                                className="font-mono"
                                {...register('instanceId')}
                            />
                            {errors.instanceId && (
                                <p
                                    id={instanceIdErrorId}
                                    className="text-danger text-xs"
                                >
                                    {errors.instanceId.message}
                                </p>
                            )}
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
                                    spellCheck={false}
                                    disabled={isPending}
                                    aria-invalid={
                                        errors.instanceToken ? true : undefined
                                    }
                                    aria-describedby={describedBy(
                                        tokenHintId,
                                        instanceTokenErrorId,
                                        Boolean(errors.instanceToken),
                                    )}
                                    className="font-mono"
                                    {...register('instanceToken')}
                                />
                                {errors.instanceToken && (
                                    <p
                                        id={instanceTokenErrorId}
                                        className="text-danger text-xs"
                                    >
                                        {errors.instanceToken.message}
                                    </p>
                                )}
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
                                    spellCheck={false}
                                    disabled={isPending}
                                    aria-invalid={
                                        errors.clientToken ? true : undefined
                                    }
                                    aria-describedby={describedBy(
                                        tokenHintId,
                                        clientTokenErrorId,
                                        Boolean(errors.clientToken),
                                    )}
                                    className="font-mono"
                                    {...register('clientToken')}
                                />
                                {errors.clientToken && (
                                    <p
                                        id={clientTokenErrorId}
                                        className="text-danger text-xs"
                                    >
                                        {errors.clientToken.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <p id={tokenHintId} className="text-subtle text-xs">
                            {configured
                                ? 'Informe os dois tokens novamente para salvar. Depois de salvos, eles não são exibidos.'
                                : 'Os dois tokens são obrigatórios e, depois de salvos, não são exibidos novamente.'}
                        </p>

                        <div className="space-y-2">
                            <Button
                                type="submit"
                                disabled={isPending}
                                aria-describedby={formHintId}
                                className="w-full sm:w-auto"
                            >
                                {isPending && (
                                    <LoaderCircle
                                        aria-hidden="true"
                                        className="size-4 motion-safe:animate-spin"
                                    />
                                )}
                                {isPending ? 'Salvando…' : 'Salvar credenciais'}
                            </Button>
                        </div>
                    </form>
                </section>
            </section>
        </Card>
    );
};
