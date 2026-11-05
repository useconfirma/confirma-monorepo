import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/tailwind';

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

// Camada sobreposta: única superfície do menu que leva sombra.
export const DropdownMenuContent = ({
    className,
    sideOffset = 8,
    ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Content>) => (
    <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
            sideOffset={sideOffset}
            className={cn(
                'rounded-card border-border bg-surface shadow-popover z-(--z-dropdown) max-w-[calc(100vw-2rem)] min-w-48 origin-(--radix-dropdown-menu-content-transform-origin) border p-1',
                'data-[state=open]:animate-scale-in data-[state=closed]:animate-fade-out',
                className,
            )}
            {...props}
        />
    </DropdownMenuPrimitive.Portal>
);

export const DropdownMenuItem = ({
    className,
    ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Item>) => (
    <DropdownMenuPrimitive.Item
        className={cn(
            'rounded-control text-foreground data-highlighted:bg-surface-muted data-disabled:text-disabled flex min-h-10 w-full cursor-default items-center gap-3 px-3 text-sm outline-none select-none data-disabled:pointer-events-none [&_svg]:shrink-0',
            className,
        )}
        {...props}
    />
);

export const DropdownMenuLabel = ({
    className,
    ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Label>) => (
    <DropdownMenuPrimitive.Label
        className={cn('px-3 py-2 text-xs', className)}
        {...props}
    />
);

export const DropdownMenuSeparator = ({
    className,
    ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Separator>) => (
    <DropdownMenuPrimitive.Separator
        className={cn('bg-border -mx-1 my-1 h-px', className)}
        {...props}
    />
);
