import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { useId, useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import type { useSignIn } from '../hooks/use-sign-in.hook';

type SignInFormProps = ReturnType<typeof useSignIn>;

/*
 * Formulário de login (API-03). Recebe estado e ações do `useSignIn` por
 * props; a validação e o envio ficam no hook. Enquanto `isPending`, campos e
 * botões ficam desabilitados.
 *
 * A tecla de mostrar senha fica em relevo dentro do campo e afunda enquanto a
 * senha está visível.
 */
export const SignInForm = ({
    register,
    errors,
    isPending,
    handleSubmit,
}: SignInFormProps) => {
    const [showPassword, setShowPassword] = useState(false);

    const emailId = useId();
    const emailErrorId = useId();
    const passwordId = useId();
    const passwordErrorId = useId();

    return (
        <form onSubmit={handleSubmit} noValidate aria-busy={isPending}>
            <div className="space-y-5">
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
                        aria-describedby={
                            errors.email ? emailErrorId : undefined
                        }
                        {...register('email')}
                    />
                    {errors.email && (
                        <p id={emailErrorId} className="text-danger text-xs">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor={passwordId}>Senha</Label>
                    <div className="relative">
                        <Input
                            id={passwordId}
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            placeholder="Sua senha"
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
                            className={[
                                'text-muted absolute top-1/2 right-1.5 grid size-7 -translate-y-1/2 place-items-center rounded-sm border bg-linear-to-b transition-[translate,box-shadow,color] duration-200',
                                'border-border from-branco to-nevoa hover:text-foreground shadow-[0_1px_2px_color-mix(in_oklab,var(--color-noite)_10%,transparent),inset_0_1px_0_var(--color-branco)]',
                                'aria-pressed:text-foreground aria-pressed:from-nevoa aria-pressed:to-branco aria-pressed:translate-y-[calc(-50%+1px)] aria-pressed:shadow-[inset_0_1px_3px_color-mix(in_oklab,var(--color-noite)_16%,transparent)]',
                                'disabled:text-disabled disabled:pointer-events-none disabled:shadow-none',
                                '[&_svg]:size-4',
                            ].join(' ')}
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
                {isPending ? 'Entrando…' : 'Entrar'}
            </Button>
        </form>
    );
};
