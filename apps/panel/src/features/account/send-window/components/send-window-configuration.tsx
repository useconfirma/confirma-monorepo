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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';
import { BRAZIL_TIME_ZONES } from '../constants/time-zones.constant';

type SendWindow =
    paths['/account']['get']['responses'][200]['content']['application/json']['account']['sendWindow'];

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long',
    timeStyle: 'short',
});

const Unavailable = () => <span className="text-subtle">Não informado</span>;

/*
 * Janela diária de envio (ENT-03), vinda de `account.sendWindow`.
 * `start` e `end` são exibidos como a API retorna (HH:mm no fuso `timeZone`),
 * sem conversão. `configured` não indica que mensagens foram enviadas.
 * Componente apresentacional: recebe os dados por props e não busca nem grava.
 * Os campos ficam desabilitados até a configuração (API-07) ser implementada.
 */
export const SendWindowConfiguration = ({
    sendWindow,
    className,
}: {
    sendWindow: SendWindow;
    className?: string;
}) => {
    const headingId = useId();
    const formHeadingId = useId();
    const startId = useId();
    const startHintId = useId();
    const endId = useId();
    const endHintId = useId();
    const timeZoneId = useId();
    const timeZoneHintId = useId();

    const { configured, start, end, timeZone, updatedAt } = sendWindow;
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
                                    Horário inicial
                                </dt>
                                <dd className="text-foreground text-sm tabular-nums">
                                    {start ?? <Unavailable />}
                                </dd>
                            </div>
                            <div className="min-w-0 space-y-1 sm:contents">
                                <dt className="text-muted text-sm">
                                    Horário final
                                </dt>
                                <dd className="text-foreground text-sm tabular-nums">
                                    {end ?? <Unavailable />}
                                </dd>
                            </div>
                            <div className="min-w-0 space-y-1 sm:contents">
                                <dt className="text-muted text-sm">
                                    Fuso horário
                                </dt>
                                <dd className="text-foreground text-sm break-words">
                                    {timeZone ? (
                                        <span className="font-mono">
                                            {timeZone}
                                        </span>
                                    ) : (
                                        <Unavailable />
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
                            A edição ainda não está disponível nesta etapa.
                        </p>
                    </div>

                    <fieldset disabled className="space-y-4">
                        <legend className="sr-only">
                            Campos da janela de envio (indisponíveis)
                        </legend>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="min-w-0 space-y-2">
                                <Label htmlFor={startId}>Horário inicial</Label>
                                <Input
                                    id={startId}
                                    type="time"
                                    defaultValue={start ?? undefined}
                                    aria-describedby={startHintId}
                                    className="tabular-nums"
                                />
                                <p
                                    id={startHintId}
                                    className="text-subtle text-xs"
                                >
                                    Incluído na janela.
                                </p>
                            </div>

                            <div className="min-w-0 space-y-2">
                                <Label htmlFor={endId}>Horário final</Label>
                                <Input
                                    id={endId}
                                    type="time"
                                    defaultValue={end ?? undefined}
                                    aria-describedby={endHintId}
                                    className="tabular-nums"
                                />
                                <p
                                    id={endHintId}
                                    className="text-subtle text-xs"
                                >
                                    Não incluído na janela. A janela não
                                    atravessa a meia-noite.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={timeZoneId}>Fuso horário</Label>
                            <Select
                                disabled
                                defaultValue={timeZone ?? undefined}
                            >
                                <SelectTrigger
                                    id={timeZoneId}
                                    aria-describedby={timeZoneHintId}
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
                            <p
                                id={timeZoneHintId}
                                className="text-subtle text-xs"
                            >
                                Os horários da janela valem neste fuso.
                            </p>
                        </div>
                    </fieldset>
                </section>
            </section>
        </Card>
    );
};
