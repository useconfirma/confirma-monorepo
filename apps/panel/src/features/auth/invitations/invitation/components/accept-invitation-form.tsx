import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { useId, useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import type { useAcceptInvitation } from '../hooks/use-accept-invitation.hook';

type AcceptInvitationFormProps = ReturnType<typeof useAcceptInvitation>;

/*
 * Formulário de criação de conta (API-02). Recebe estado e ações do
 * `useAcceptInvitation` por props; a validação e o envio ficam no hook. O
 * token vem da rota e o e-mail vem do convite, então só nome da conta, senha e
 * confirmação são pedidos. Enquanto `isPending`, campos e botões ficam
 * desabilitados.
 *
 * Senha e confirmação têm a mesma interface. Cada uma tem sua tecla de mostrar
 * senha, que fica em relevo dentro do campo e afunda enquanto ele está visível.
 */
export const AcceptInvitationForm = ({
    register,
    errors,
    isPending,
    handleSubmit,
}: AcceptInvitationFormProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const accountNameId = useId();
    const accountNameErrorId = useId();
    const passwordId = useId();
    const passwordErrorId = useId();
    const confirmPasswordId = useId();
    const confirmPasswordErrorId = useId();

    const toggleClassName = [
        'text-muted absolute top-1/2 right-1.5 grid size-7 -translate-y-1/2 place-items-center rounded-sm border bg-linear-to-b transition-[translate,box-shadow,color] duration-200',
        'border-border from-branco to-nevoa hover:text-foreground shadow-[0_1px_2px_color-mix(in_oklab,var(--color-noite)_10%,transparent),inset_0_1px_0_var(--color-branco)]',
        'aria-pressed:text-foreground aria-pressed:from-nevoa aria-pressed:to-branco aria-pressed:translate-y-[calc(-50%+1px)] aria-pressed:shadow-[inset_0_1px_3px_color-mix(in_oklab,var(--color-noite)_16%,transparent)]',
        'disabled:text-disabled disabled:pointer-events-none disabled:shadow-none',
        '[&_svg]:size-4',
    ].join(' ');

    return (
        <form onSubmit={handleSubmit} noValidate aria-busy={isPending}>
            <div className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor={accountNameId}>Nome da conta</Label>
                    <Input
                        id={accountNameId}
                        type="text"
                        autoComplete="organization"
                        placeholder="Clínica Exemplo"
                        disabled={isPending}
                        aria-invalid={errors.accountName ? true : undefined}
                        aria-describedby={
                            errors.accountName ? accountNameErrorId : undefined
                        }
                        {...register('accountName')}
                    />
                    {errors.accountName && (
                        <p
                            id={accountNameErrorId}
                            className="text-danger text-xs"
                        >
                            {errors.accountName.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor={passwordId}>Senha</Label>
                    <div className="relative">
                        <Input
                            id={passwordId}
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            placeholder="Crie uma senha"
                            disabled={isPending}
                            aria-invalid={errors.password ? true : undefined}
                            aria-describedby={
                                errors.password ? passwordErrorId : undefined
                            }
                            className="pr-11"
                            {...register('password')}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((value) => !value)}
                            disabled={isPending}
                            aria-pressed={showPassword}
                            aria-controls={passwordId}
                            aria-label="Mostrar senha"
                            className={toggleClassName}
                        >
                            {showPassword ? (
                                <EyeOff aria-hidden="true" />
                            ) : (
                                <Eye aria-hidden="true" />
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p id={passwordErrorId} className="text-danger text-xs">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor={confirmPasswordId}>Confirmar senha</Label>
                    <div className="relative">
                        <Input
                            id={confirmPasswordId}
                            type={showConfirmPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            placeholder="Repita a senha"
                            disabled={isPending}
                            aria-invalid={
                                errors.confirmPassword ? true : undefined
                            }
                            aria-describedby={
                                errors.confirmPassword
                                    ? confirmPasswordErrorId
                                    : undefined
                            }
                            className="pr-11"
                            {...register('confirmPassword')}
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword((value) => !value)
                            }
                            disabled={isPending}
                            aria-pressed={showConfirmPassword}
                            aria-controls={confirmPasswordId}
                            aria-label="Mostrar confirmação de senha"
                            className={toggleClassName}
                        >
                            {showConfirmPassword ? (
                                <EyeOff aria-hidden="true" />
                            ) : (
                                <Eye aria-hidden="true" />
                            )}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p
                            id={confirmPasswordErrorId}
                            className="text-danger text-xs"
                        >
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>
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
                {isPending ? 'Criando conta…' : 'Criar conta'}
            </Button>
        </form>
    );
};
