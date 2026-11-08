import { Check, CircleDashed, LoaderCircle } from 'lucide-react';
import { useId } from 'react';
import { Controller } from 'react-hook-form';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';
import { BRAZIL_TIME_ZONES } from '../constants/time-zones.constant';
import type { useConfigureSendWindow } from '../hooks/use-configure-send-window.hook';

type SendWindow =
    paths['/account']['get']['responses'][200]['content']['application/json']['account']['sendWindow'];

type SendWindowConfigurationProps = ReturnType<
    typeof useConfigureSendWindow
> & {
    sendWindow: SendWindow;
    className?: string;
};

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long',
    timeStyle: 'short',
});

const Unavailable = () => <span className="text-subtle">Não informada</span>;

// Liga o campo à dica e, quando houver, à mensagem de erro.
const describedBy = (hintId: string, errorId: string, hasError: boolean) =>
    hasError ? `${hintId} ${errorId}` : hintId;

/*
 * Janela diária de envio (ENT-03), vinda de `account.sendWindow`, e a
 * configuração (API-07), com estado e ações do `useConfigureSendWindow`
 * recebidos por props. A janela atual aparece nos próprios campos do
 * formulário (HH:mm no fuso `timeZone`, sem conversão); o resumo mostra só a
 * última atualização. Início inclusivo, fim exclusivo, sem atravessar a
 * meia-noite (BR-03). `configured` não indica que mensagens foram enviadas.
 */
export const SendWindowConfiguration = ({
    sendWindow,
    className,
    register,
    control,
    errors,
    isPending,
    isError,
    isSuccess,
    handleSubmit,
}: SendWindowConfigurationProps) => {
    const headingId = useId();
    const formHeadingId = useId();
    const startId = useId();
    const startHintId = useId();
    const startErrorId = useId();
    const endId = useId();
    const endHintId = useId();
    const endErrorId = useId();
    const timeZoneId = useId();
    const timeZoneHintId = useId();
    const timeZoneErrorId = useId();
    const submitStatusId = useId();

    const { configured, timeZone, updatedAt } = sendWindow;
    const isBrazilTimeZone = BRAZIL_TIME_ZONES.some(
        ({ value }) => value === timeZone,
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
                                {configured ? 'Configurado' : 'Pendente'}
                            </Badge>
                        </div>
                        <CardDescription>
                            {configured
                                ? 'As tentativas de envio das confirmações só começam dentro deste intervalo diário, no fuso indicado.'
                                : 'A janela de envio ainda não foi definida para esta conta.'}
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
                                ? 'Alterar janela de envio'
                                : 'Definir janela de envio'}
                        </h3>
                        <p className="text-muted text-sm text-pretty">
                            {configured
                                ? 'A nova janela substitui a atual e passa a valer para as próximas tentativas de envio.'
                                : 'Defina o intervalo diário em que o Confirma pode enviar as mensagens de confirmação.'}
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        noValidate
                        aria-busy={isPending}
                        aria-labelledby={formHeadingId}
                        className="space-y-4"
                    >
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="min-w-0 space-y-2">
                                <Label htmlFor={startId}>Horário inicial</Label>
                                <Input
                                    id={startId}
                                    type="time"
                                    disabled={isPending}
                                    aria-invalid={
                                        errors.start ? true : undefined
                                    }
                                    aria-describedby={describedBy(
                                        startHintId,
                                        startErrorId,
                                        Boolean(errors.start),
                                    )}
                                    className="tabular-nums"
                                    {...register('start')}
                                />
                                <p
                                    id={startHintId}
                                    className="text-subtle text-xs"
                                >
                                    Incluído na janela.
                                </p>
                                {errors.start && (
                                    <p
                                        id={startErrorId}
                                        className="text-danger text-xs"
                                    >
                                        {errors.start.message}
                                    </p>
                                )}
                            </div>

                            <div className="min-w-0 space-y-2">
                                <Label htmlFor={endId}>Horário final</Label>
                                <Input
                                    id={endId}
                                    type="time"
                                    disabled={isPending}
                                    aria-invalid={errors.end ? true : undefined}
                                    aria-describedby={describedBy(
                                        endHintId,
                                        endErrorId,
                                        Boolean(errors.end),
                                    )}
                                    className="tabular-nums"
                                    {...register('end')}
                                />
                                <p
                                    id={endHintId}
                                    className="text-subtle text-xs"
                                >
                                    Não incluído na janela. A janela não
                                    atravessa a meia-noite.
                                </p>
                                {errors.end && (
                                    <p
                                        id={endErrorId}
                                        className="text-danger text-xs"
                                    >
                                        {errors.end.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={timeZoneId}>Fuso horário</Label>
                            <Controller
                                control={control}
                                name="timeZone"
                                render={({ field }) => (
                                    <Select
                                        name={field.name}
                                        value={field.value || undefined}
                                        onValueChange={field.onChange}
                                        disabled={isPending}
                                    >
                                        <SelectTrigger
                                            ref={field.ref}
                                            id={timeZoneId}
                                            onBlur={field.onBlur}
                                            aria-invalid={
                                                errors.timeZone
                                                    ? true
                                                    : undefined
                                            }
                                            aria-describedby={describedBy(
                                                timeZoneHintId,
                                                timeZoneErrorId,
                                                Boolean(errors.timeZone),
                                            )}
                                        >
                                            <SelectValue placeholder="Selecione o fuso horário" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {/* Fuso salvo fora da lista: exibido como veio da API. */}
                                            {timeZone && !isBrazilTimeZone && (
                                                <SelectItem value={timeZone}>
                                                    {timeZone}
                                                </SelectItem>
                                            )}
                                            {BRAZIL_TIME_ZONES.map(
                                                ({ value, label }) => (
                                                    <SelectItem
                                                        key={value}
                                                        value={value}
                                                    >
                                                        {label}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <p
                                id={timeZoneHintId}
                                className="text-subtle text-xs"
                            >
                                Os horários da janela valem neste fuso.
                            </p>
                            {errors.timeZone && (
                                <p
                                    id={timeZoneErrorId}
                                    className="text-danger text-xs"
                                >
                                    {errors.timeZone.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Button
                                type="submit"
                                disabled={isPending}
                                aria-describedby={
                                    isError || isSuccess
                                        ? submitStatusId
                                        : undefined
                                }
                                className="w-full sm:w-auto"
                            >
                                {isPending && (
                                    <LoaderCircle
                                        aria-hidden="true"
                                        className="size-4 motion-safe:animate-spin"
                                    />
                                )}
                                {isPending ? 'Salvando…' : 'Salvar janela'}
                            </Button>
                            {isError && (
                                <p
                                    id={submitStatusId}
                                    role="alert"
                                    className="text-danger text-xs"
                                >
                                    Não foi possível salvar a janela de envio.
                                    Confira os horários e o fuso e tente
                                    novamente.
                                </p>
                            )}
                            {isSuccess && (
                                <p
                                    id={submitStatusId}
                                    role="status"
                                    className="text-success flex items-center gap-1 text-xs"
                                >
                                    <Check
                                        aria-hidden="true"
                                        className="size-3.5"
                                    />
                                    Janela de envio salva.
                                </p>
                            )}
                        </div>
                    </form>
                </section>
            </section>
        </Card>
    );
};
