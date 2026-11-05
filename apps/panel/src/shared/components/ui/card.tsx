import { Slot } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/tailwind';

type SlotProps<T extends 'div' | 'h2' | 'p'> = ComponentProps<T> & {
    /** Troca o elemento (ex.: `section`, `header`, `h3`) mantendo o estilo. */
    asChild?: boolean;
};

// Folha branca sobre a folha: só borda, sem sombra.
export const Card = ({ asChild, className, ...props }: SlotProps<'div'>) => {
    const Comp = asChild ? Slot.Root : 'div';
    return (
        <Comp
            className={cn(
                'rounded-card border-border bg-surface border',
                className,
            )}
            {...props}
        />
    );
};

export const CardHeader = ({
    asChild,
    className,
    ...props
}: SlotProps<'div'>) => {
    const Comp = asChild ? Slot.Root : 'div';
    return (
        <Comp
            className={cn('flex flex-col gap-1 p-4 sm:p-6', className)}
            {...props}
        />
    );
};

export const CardTitle = ({
    asChild,
    className,
    ...props
}: SlotProps<'h2'>) => {
    const Comp = asChild ? Slot.Root : 'h2';
    return (
        <Comp
            className={cn(
                'text-foreground text-lg font-semibold text-balance',
                className,
            )}
            {...props}
        />
    );
};

export const CardDescription = ({
    asChild,
    className,
    ...props
}: SlotProps<'p'>) => {
    const Comp = asChild ? Slot.Root : 'p';
    return (
        <Comp
            className={cn('text-muted text-sm text-pretty', className)}
            {...props}
        />
    );
};

export const CardContent = ({
    asChild,
    className,
    ...props
}: SlotProps<'div'>) => {
    const Comp = asChild ? Slot.Root : 'div';
    return (
        <Comp
            className={cn('px-4 pb-4 sm:px-6 sm:pb-6', className)}
            {...props}
        />
    );
};

export const CardFooter = ({
    asChild,
    className,
    ...props
}: SlotProps<'div'>) => {
    const Comp = asChild ? Slot.Root : 'div';
    return (
        <Comp
            className={cn(
                'border-border flex flex-wrap items-center justify-end gap-2 border-t px-4 py-3 sm:px-6',
                className,
            )}
            {...props}
        />
    );
};
