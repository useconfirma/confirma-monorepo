import { LoaderCircle, MailCheck } from 'lucide-react';
import { useId } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import type { useRequestInvitation } from '../hooks/use-request-invitation.hook';

type RequestInvitationFormProps = ReturnType<typeof useRequestInvitation>;

/*
 * Pedido de convite (API-01). Recebe estado e ações do `useRequestInvitation`
 * por props; a validação e o envio ficam no hook. Enquanto `isPending`, campo
 * e botão ficam desabilitados. Depois do envio, o formulário dá lugar à
 * confirmação, em Verde, com o e-mail informado.
 */
export const RequestInvitationForm = ({
    register,
    errors,
    isPending,
    isSuccess,
    sentTo,
    handleSubmit,
    reset,
}: RequestInvitationFormProps) => {
    const emailId = useId();
    const emailErrorId = useId();

    if (isSuccess) {
        return (
            <div
                role="status"
                className="rounded-card border-success/20 bg-success-soft motion-safe:animate-scale-in border p-4"
            >
                <div className="flex gap-3">
                    <MailCheck
                        aria-hidden="true"
                        className="text-success mt-0.5 size-5 shrink-0"
                    />
                    <div className="min-w-0">
                        <p className="text-foreground text-sm font-semibold">
                            Convite enviado
                        </p>
                        <p className="text-muted mt-1 text-sm text-pretty">
                            Enviamos o link para{' '}
                            <span className="text-foreground font-medium break-all">
                                {sentTo}
                            </span>
                            . Ele vale por 72 horas. Se não encontrar, confira a
                            caixa de spam.
                        </p>
                    </div>
                </div>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={reset}
                    className="mt-4"
                >
                    Usar outro e-mail
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} noValidate aria-busy={isPending}>
            <div className="space-y-2">
                <Label htmlFor={emailId}>E-mail</Label>
                <Input
                    id={emailId}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder="nome@empresa.com.br"
                    disabled={isPending}
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={errors.email ? emailErrorId : undefined}
                    {...register('email')}
                />
                {errors.email && (
                    <p id={emailErrorId} className="text-danger text-xs">
                        {errors.email.message}
                    </p>
                )}
            </div>

            <Button
                type="submit"
                size="lg"
                disabled={isPending}
                className="mt-7 w-full"
            >
                {isPending && (
                    <LoaderCircle
                        aria-hidden="true"
                        className="size-4 motion-safe:animate-spin"
                    />
                )}
                {isPending ? 'Enviando convite…' : 'Enviar convite'}
            </Button>
        </form>
    );
};
