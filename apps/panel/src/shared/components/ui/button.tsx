import { Slot } from 'radix-ui';
import type { ComponentProps } from 'react';
import { tv, type VariantProps } from '@/shared/lib/tailwind';

/*
 * Botões em esmalte, com luz vinda de cima: borda superior mais clara,
 * sombra projetada para baixo e afundamento ao pressionar.
 * Primário = Noite (ação principal); secundário = Branco em relevo.
 */
export const buttonVariants = tv({
    base: [
        'rounded-control inline-flex shrink-0 items-center justify-center gap-2 border bg-linear-to-b text-sm font-medium whitespace-nowrap select-none',
        'transition-[translate,box-shadow,color,--tw-gradient-from,--tw-gradient-to] duration-200 active:translate-y-px',
        'disabled:text-disabled aria-disabled:text-disabled disabled:from-nevoa disabled:to-nevoa aria-disabled:from-nevoa aria-disabled:to-nevoa disabled:border-border aria-disabled:border-border disabled:pointer-events-none disabled:shadow-none aria-disabled:pointer-events-none aria-disabled:shadow-none',
        '[&_svg]:shrink-0',
    ],
    variants: {
        variant: {
            primary: [
                'from-verde-escuro to-noite text-primary-foreground border-branco/10 border-t-branco/20',
                'hover:from-verde-profundo hover:to-verde-escuro active:from-noite active:to-noite',
                'shadow-[0_4px_8px_-4px_color-mix(in_oklab,var(--color-noite)_60%,transparent),inset_0_1px_0_color-mix(in_oklab,var(--color-branco)_14%,transparent)]',
                'active:shadow-[inset_0_2px_4px_color-mix(in_oklab,var(--color-noite)_70%,black)]',
            ],
            secondary: [
                'border-border from-branco to-nevoa text-secondary-foreground hover:to-verde-claro',
                'shadow-[0_1px_2px_color-mix(in_oklab,var(--color-noite)_8%,transparent),inset_0_1px_0_var(--color-branco)]',
                'active:shadow-[inset_0_1px_3px_color-mix(in_oklab,var(--color-noite)_14%,transparent)]',
            ],
        },
        size: {
            sm: 'h-9 px-4',
            md: 'h-10 px-4',
            lg: 'h-11 px-6',
            icon: 'size-10',
        },
    },
    defaultVariants: {
        variant: 'primary',
        size: 'md',
    },
});

type ButtonProps = ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
        /** Repassa estilo e props ao filho único (ex.: `Link`). */
        asChild?: boolean;
    };

export const Button = ({
    asChild = false,
    variant,
    size,
    className,
    type,
    ...props
}: ButtonProps) => {
    const Comp = asChild ? Slot.Root : 'button';

    return (
        <Comp
            type={asChild ? type : (type ?? 'button')}
            className={buttonVariants({ variant, size, className })}
            {...props}
        />
    );
};
