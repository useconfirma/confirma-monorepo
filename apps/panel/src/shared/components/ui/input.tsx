import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/tailwind';

/*
 * Campo rebaixado na folha (sombra interna, luz vinda de cima). O erro vem de
 * `aria-invalid`, para que o estado visual e o acessível sejam o mesmo.
 * Chaves, IDs e URLs: passe `font-mono`.
 */
export const Input = ({
    className,
    type = 'text',
    ...props
}: ComponentProps<'input'>) => (
    <input
        type={type}
        className={cn(
            'rounded-control border-border bg-surface text-foreground placeholder:text-subtle h-10 w-full min-w-0 border px-3 text-sm shadow-[inset_0_1px_2px_color-mix(in_oklab,var(--color-noite)_8%,transparent)] transition-[border-color,box-shadow]',
            'hover:border-border-strong focus-visible:border-ring focus-visible:outline-offset-0',
            'aria-invalid:border-danger aria-invalid:focus-visible:outline-danger',
            'disabled:bg-surface-muted disabled:text-disabled disabled:cursor-not-allowed disabled:shadow-none',
            'read-only:bg-surface-muted',
            'file:text-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium',
            className,
        )}
        {...props}
    />
);
