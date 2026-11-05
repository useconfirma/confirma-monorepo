import { Check, ChevronDown } from 'lucide-react';
import { Select as SelectPrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/tailwind';

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;

// Gatilho com o mesmo campo rebaixado do Input; o placeholder usa `text-subtle`.
export const SelectTrigger = ({
    className,
    children,
    ...props
}: ComponentProps<typeof SelectPrimitive.Trigger>) => (
    <SelectPrimitive.Trigger
        className={cn(
            'rounded-control border-border bg-surface text-foreground flex h-10 w-full min-w-0 items-center justify-between gap-2 border px-3 text-left text-sm shadow-[inset_0_1px_2px_color-mix(in_oklab,var(--color-noite)_8%,transparent)] transition-[border-color,box-shadow]',
            'hover:border-border-strong focus-visible:border-ring focus-visible:outline-offset-0',
            'data-placeholder:text-subtle aria-invalid:border-danger',
            'disabled:bg-surface-muted disabled:text-disabled disabled:cursor-not-allowed disabled:shadow-none',
            '[&>span]:truncate',
            className,
        )}
        {...props}
    >
        {children}
        <SelectPrimitive.Icon asChild>
            <ChevronDown
                aria-hidden="true"
                className="text-subtle size-4 shrink-0"
            />
        </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
);

// Camada sobreposta, como o DropdownMenuContent: única superfície com sombra.
export const SelectContent = ({
    className,
    children,
    position = 'popper',
    sideOffset = 8,
    ...props
}: ComponentProps<typeof SelectPrimitive.Content>) => (
    <SelectPrimitive.Portal>
        <SelectPrimitive.Content
            position={position}
            sideOffset={sideOffset}
            className={cn(
                'rounded-card border-border bg-surface shadow-popover z-(--z-dropdown) max-h-(--radix-select-content-available-height) w-(--radix-select-trigger-width) max-w-[calc(100vw-2rem)] origin-(--radix-select-content-transform-origin) overflow-hidden border',
                'data-[state=open]:animate-scale-in data-[state=closed]:animate-fade-out',
                className,
            )}
            {...props}
        >
            <SelectPrimitive.Viewport className="p-1">
                {children}
            </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
);

export const SelectItem = ({
    className,
    children,
    ...props
}: ComponentProps<typeof SelectPrimitive.Item>) => (
    <SelectPrimitive.Item
        className={cn(
            'rounded-control text-foreground data-highlighted:bg-surface-muted data-disabled:text-disabled relative flex min-h-10 w-full cursor-default items-center gap-3 py-2 pr-9 pl-3 text-sm outline-none select-none data-disabled:pointer-events-none',
            className,
        )}
        {...props}
    >
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        <SelectPrimitive.ItemIndicator className="text-success absolute right-3">
            <Check aria-hidden="true" className="size-4" />
        </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
);
