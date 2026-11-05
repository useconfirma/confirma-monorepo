import { Label as LabelPrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/tailwind';

export const Label = ({
    className,
    ...props
}: ComponentProps<typeof LabelPrimitive.Root>) => (
    <LabelPrimitive.Root
        className={cn(
            'text-foreground text-sm font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-60',
            className,
        )}
        {...props}
    />
);
