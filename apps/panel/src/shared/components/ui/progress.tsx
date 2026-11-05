import { Progress as ProgressPrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/tailwind';

type ProgressProps = ComponentProps<typeof ProgressPrimitive.Root>;

// Trilho rebaixado com o preenchimento Menta → Verde em relevo.
export const Progress = ({
    value,
    max = 100,
    className,
    ...props
}: ProgressProps) => {
    const percent = value == null ? 0 : (value / max) * 100;

    return (
        <ProgressPrimitive.Root
            value={value}
            max={max}
            className={cn(
                'bg-cinza-verde-claro relative h-2 min-w-0 overflow-hidden rounded-full shadow-[inset_0_1px_2px_color-mix(in_oklab,var(--color-noite)_18%,transparent)]',
                className,
            )}
            {...props}
        >
            <ProgressPrimitive.Indicator
                className="from-menta to-verde h-full rounded-full bg-linear-to-b shadow-[inset_0_1px_0_color-mix(in_oklab,var(--color-branco)_35%,transparent)] transition-[width] duration-200"
                style={{ width: `${percent}%` }}
            />
        </ProgressPrimitive.Root>
    );
};
