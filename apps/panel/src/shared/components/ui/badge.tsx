import type { ComponentProps } from 'react';
import { tv, type VariantProps } from '@/shared/lib/tailwind';

/*
 * Selo de estado. `success` usa o Verde de confirmação; `neutral` tem borda
 * tracejada para "ainda não feito". Acompanhe sempre de texto (e ícone),
 * nunca só de cor.
 */
export const badgeVariants = tv({
    base: 'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap [&_svg]:size-3.5 [&_svg]:shrink-0',
    variants: {
        variant: {
            success: 'bg-success-soft text-success border-success/20',
            neutral: 'text-muted border-border-strong border-dashed',
        },
    },
    defaultVariants: {
        variant: 'neutral',
    },
});

type BadgeProps = ComponentProps<'span'> & VariantProps<typeof badgeVariants>;

export const Badge = ({ variant, className, ...props }: BadgeProps) => (
    <span className={badgeVariants({ variant, className })} {...props} />
);
