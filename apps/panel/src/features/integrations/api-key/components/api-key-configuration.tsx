import { Check, CircleDashed, LoaderCircle, Mail } from 'lucide-react';
import { useId, useRef } from 'react';
import type { paths } from '@/shared/@types/api';
import { ConfirmDialog } from '@/shared/components/confirm-dialog';
import { SecretRevealDialog } from '@/shared/components/secret-reveal-dialog';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card';
import type { useGenerateApiKey } from '../hooks/use-generate-api-key.hook';

type ApiKey =
    paths['/account']['get']['responses'][200]['content']['application/json']['account']['apiKey'];

type ApiKeyConfigurationProps = ReturnType<typeof useGenerateApiKey> & {
    apiKey: ApiKey;
    className?: string;
};

// Linha de ação: texto à esquerda, botão à direita; empilha no celular.
const rowClassName =
    'flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 sm:py-5';

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long',
    timeStyle: 'short',
});

/*
 * API Key atual da conta (ENT-04), vinda de `account.apiKey`, e a geração
 * (API-08), com estado e ações do `useGenerateApiKey` recebidos por props.
 * `configured` só diz que uma chave foi gerada: não indica que ela já foi
 * usada. O valor da chave nunca é retornado por GET /account, então nada
 * dele (nem prefixo ou máscara) é exibido aqui; a chave nova aparece só no
 * `SecretRevealDialog`.
 * Sem chave, a ação gera direto. Com chave, passa pelo `ConfirmDialog`,
 * porque a atual deixa de funcionar.
 * "Enviar por e-mail" é só a indicação de uma ação futura: fica desabilitada
 * e não tem comportamento.
 */
export const ApiKeyConfiguration = ({
    apiKey,
    className,
    generate,
    isPending,
    isError,
    generatedApiKey,
    reset,
}: ApiKeyConfigurationProps) => {
    const actionRef = useRef<HTMLButtonElement>(null);

    const headingId = useId();
    const actionHintId = useId();
    const actionErrorId = useId();
    const emailHintId = useId();

    const { configured, createdAt } = apiKey;

    const handleRevealClosed = () => {
        reset();
        actionRef.current?.focus();
    };

    const actionButton = (
        <Button
            ref={actionRef}
            variant={configured ? 'secondary' : 'primary'}
            disabled={isPending}
            onClick={configured ? undefined : generate}
            aria-describedby={
                isError ? `${actionHintId} ${actionErrorId}` : actionHintId
            }
            className="w-full sm:w-auto"
        >
            {isPending && (
                <LoaderCircle
                    aria-hidden="true"
                    className="size-4 motion-safe:animate-spin"
                />
            )}
            {isPending
                ? 'Gerando…'
                : configured
                  ? 'Gerar nova API Key'
                  : 'Gerar API Key'}
        </Button>
    );

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
                                {configured ? 'Configurada' : 'Pendente'}
                            </Badge>
                        </div>
                        <CardDescription>
                            {!configured &&
                                'Nenhuma API Key foi gerada para esta conta. Você vai precisar de uma para autenticar as chamadas do seu sistema à API pública.'}
                            {configured && createdAt && (
                                <>
                                    Gerada em{' '}
                                    <time
                                        dateTime={createdAt}
                                        className="text-foreground"
                                    >
                                        {dateFormatter.format(
                                            new Date(createdAt),
                                        )}
                                    </time>
                                </>
                            )}
                            {configured &&
                                !createdAt &&
                                'Data de geração não informada.'}
                        </CardDescription>
                    </header>
                </CardHeader>

                <ul className="divide-border border-border divide-y border-t">
                    <li className={rowClassName} aria-busy={isPending}>
                        <div className="min-w-0 space-y-1">
                            <h3 className="text-foreground text-sm font-semibold">
                                {configured
                                    ? 'Substituir a chave'
                                    : 'Gerar a primeira chave'}
                            </h3>
                            <p
                                id={actionHintId}
                                className="text-muted text-sm text-pretty"
                            >
                                {configured
                                    ? 'A chave atual deixa de funcionar quando uma nova é gerada.'
                                    : 'O valor da chave é exibido uma única vez, logo após a geração.'}
                            </p>
                            {isError && (
                                <p
                                    id={actionErrorId}
                                    role="alert"
                                    className="text-danger text-xs"
                                >
                                    Não foi possível gerar a API Key. Tente
                                    novamente.
                                </p>
                            )}
                        </div>

                        {configured ? (
                            <ConfirmDialog
                                title="Gerar nova API Key?"
                                description="A API Key atual será invalidada e o seu sistema deixará de autenticar com ela. Uma nova chave será criada, e o valor dela será exibido somente agora, uma única vez."
                                confirmLabel="Gerar nova API Key"
                                onConfirm={generate}
                            >
                                {actionButton}
                            </ConfirmDialog>
                        ) : (
                            actionButton
                        )}
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

                {generatedApiKey && (
                    <SecretRevealDialog
                        title="API Key gerada"
                        description="Copie a chave e guarde-a em um local seguro. Ela não será exibida novamente depois que você fechar esta janela."
                        secret={generatedApiKey}
                        secretLabel="Nova API Key"
                        copyLabel="Copiar API Key"
                        copiedMessage="API Key copiada para a área de transferência."
                        onClosed={handleRevealClosed}
                    />
                )}
            </section>
        </Card>
    );
};
