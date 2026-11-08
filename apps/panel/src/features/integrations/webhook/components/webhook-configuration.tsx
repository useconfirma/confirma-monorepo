import { Check, CircleDashed, LoaderCircle, Mail } from 'lucide-react';
import { useId, useRef } from 'react';
import type { paths } from '@/shared/@types/api';
import { ConfirmDialog } from '@/shared/components/confirm-dialog';
import { SecretRevealDialog } from '@/shared/components/secret-reveal-dialog';
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
import type { useConfigureWebhook } from '../hooks/use-configure-webhook.hook';

type Webhook =
    paths['/account']['get']['responses'][200]['content']['application/json']['account']['webhook'];

type WebhookConfigurationProps = ReturnType<typeof useConfigureWebhook> & {
    webhook: Webhook;
    className?: string;
};

// Linha de ação: texto à esquerda, botão à direita; empilha no celular.
const rowClassName =
    'flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 sm:py-5';

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long',
    timeStyle: 'short',
});

const Unavailable = () => (
    <span className="text-subtle font-sans">Não informada</span>
);

/*
 * Destino de entrega do webhook (ENT-03), vindo de `account.webhook`, e a
 * configuração (API-09), com estado e ações do `useConfigureWebhook`
 * recebidos por props. `configured` só diz que o webhook foi cadastrado: não
 * garante que esteja operacional.
 * O segredo de assinatura não é digitado: cada salvamento gera um novo, exibido
 * uma única vez no `SecretRevealDialog`. Com webhook configurado, salvar passa
 * pelo `ConfirmDialog`, porque o segredo atual deixa de valer.
 * "Enviar por e-mail" é só a indicação de uma ação futura: fica desabilitada
 * e não tem comportamento.
 */
export const WebhookConfiguration = ({
    webhook,
    className,
    register,
    errors,
    isPending,
    handleSubmit,
    isConfirming,
    confirm,
    changeConfirmation,
    generatedSecret,
    reset,
}: WebhookConfigurationProps) => {
    const submitRef = useRef<HTMLButtonElement>(null);

    const headingId = useId();
    const formHeadingId = useId();
    const formHintId = useId();
    const urlId = useId();
    const urlHintId = useId();
    const urlErrorId = useId();
    const emailHintId = useId();

    const { configured, updatedAt } = webhook;

    const handleRevealClosed = () => {
        reset();
        submitRef.current?.focus();
    };

    return (
        <Card asChild className={className}>
            <section aria-labelledby={headingId}>
                <CardHeader asChild>
                    <header>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <CardTitle id={headingId}>
                                Destino de entrega
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
                                ? 'Endereço que recebe os resultados das confirmações dos seus agendamentos.'
                                : 'Ainda não existe um destino configurado. Sem ele, o seu sistema não recebe os resultados das confirmações.'}
                        </CardDescription>
                    </header>
                </CardHeader>

                {configured && (
                    <CardContent>
                        <dl className="grid gap-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-x-6 sm:gap-y-3">
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
                                        <Unavailable />
                                    )}
                                </dd>
                            </div>
                        </dl>
                    </CardContent>
                )}

                <ul className="divide-border border-border divide-y border-t">
                    <li className="space-y-4 p-4 sm:p-6">
                        <div className="space-y-1">
                            <h3
                                id={formHeadingId}
                                className="text-foreground text-sm font-semibold"
                            >
                                {configured
                                    ? 'Alterar destino'
                                    : 'Configurar destino'}
                            </h3>
                            <p
                                id={formHintId}
                                className="text-muted text-sm text-pretty"
                            >
                                {configured
                                    ? 'Salvar gera um novo segredo de assinatura, e o atual deixa de valer. O novo valor é exibido uma única vez.'
                                    : 'Ao salvar, o Confirma gera o segredo de assinatura das entregas. O valor é exibido uma única vez.'}
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
                                <Label htmlFor={urlId}>URL HTTPS</Label>
                                <Input
                                    id={urlId}
                                    type="url"
                                    inputMode="url"
                                    placeholder="https://"
                                    autoComplete="off"
                                    autoCapitalize="none"
                                    spellCheck={false}
                                    disabled={isPending}
                                    aria-invalid={errors.url ? true : undefined}
                                    aria-describedby={
                                        errors.url
                                            ? `${urlHintId} ${urlErrorId}`
                                            : urlHintId
                                    }
                                    className="font-mono"
                                    {...register('url')}
                                />
                                <p
                                    id={urlHintId}
                                    className="text-subtle text-xs"
                                >
                                    Endpoint do seu sistema que receberá os
                                    eventos. Precisa usar HTTPS.
                                </p>
                                {errors.url && (
                                    <p
                                        id={urlErrorId}
                                        className="text-danger text-xs"
                                    >
                                        {errors.url.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Button
                                    ref={submitRef}
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
                                    {isPending ? 'Salvando…' : 'Salvar destino'}
                                </Button>
                            </div>
                        </form>
                    </li>

                    <li className={rowClassName}>
                        <div className="min-w-0 space-y-1">
                            <h3 className="text-foreground text-sm font-semibold">
                                Envio por e-mail
                            </h3>
                            <p
                                id={emailHintId}
                                className="text-muted text-sm text-pretty"
                            >
                                Ainda não disponível.
                            </p>
                        </div>

                        <Button
                            variant="secondary"
                            disabled
                            aria-describedby={emailHintId}
                            className="w-full sm:w-auto"
                        >
                            <Mail aria-hidden="true" className="size-4" />
                            Enviar por e-mail
                        </Button>
                    </li>
                </ul>

                <ConfirmDialog
                    open={isConfirming}
                    onOpenChange={changeConfirmation}
                    title="Gerar novo segredo?"
                    description="O destino será salvo com um novo segredo de assinatura. O segredo atual deixará de valer e o seu sistema precisará usar o novo para verificar as entregas. O valor será exibido somente agora, uma única vez."
                    confirmLabel="Salvar e gerar segredo"
                    onConfirm={confirm}
                />

                {generatedSecret && (
                    <SecretRevealDialog
                        title="Segredo de assinatura gerado"
                        description="Copie o segredo e configure-o no seu sistema para verificar a assinatura das entregas. Ele não será exibido novamente depois que você fechar esta janela."
                        secret={generatedSecret}
                        secretLabel="Novo segredo de assinatura"
                        copyLabel="Copiar segredo"
                        copiedMessage="Segredo copiado para a área de transferência."
                        onClosed={handleRevealClosed}
                    />
                )}
            </section>
        </Card>
    );
};
