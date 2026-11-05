import { X } from 'lucide-react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn, tv, type VariantProps } from '@/shared/lib/tailwind';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export const DialogOverlay = ({
    className,
    ...props
}: ComponentProps<typeof DialogPrimitive.Overlay>) => (
    <DialogPrimitive.Overlay
        className={cn(
            'bg-overlay data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out fixed inset-0 z-(--z-overlay)',
            className,
        )}
        {...props}
    />
);

/*
 * `modal`: folha branca centralizada, com botão de fechar.
 * `drawer`: gaveta presa à esquerda, recuada da moldura; o conteúdo define o
 * próprio material e o próprio botão de fechar.
 */
const dialogContent = tv({
    base: 'fixed z-(--z-dialog) flex flex-col focus:outline-none',
    variants: {
        variant: {
            modal: 'rounded-sheet border-border bg-surface shadow-dialog data-[state=open]:animate-slide-up data-[state=closed]:animate-fade-out top-1/2 left-1/2 max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-md -translate-1/2 overflow-y-auto border p-6',
            drawer: 'inset-y-frame left-frame data-[state=open]:animate-drawer-in data-[state=closed]:animate-drawer-out w-72 max-w-[calc(100vw-3rem)]',
        },
    },
    defaultVariants: {
        variant: 'modal',
    },
});

type DialogContentProps = ComponentProps<typeof DialogPrimitive.Content> &
    VariantProps<typeof dialogContent>;

export const DialogContent = ({
    variant = 'modal',
    className,
    children,
    ...props
}: DialogContentProps) => (
    <DialogPrimitive.Portal>
        <DialogOverlay />
        <DialogPrimitive.Content
            className={dialogContent({ variant, className })}
            {...props}
        >
            {children}
            {variant === 'modal' && (
                <DialogPrimitive.Close
                    aria-label="Fechar"
                    className="rounded-control text-muted hover:bg-surface-muted hover:text-foreground absolute top-4 right-4 flex size-8 items-center justify-center transition-colors"
                >
                    <X aria-hidden="true" size={18} strokeWidth={1.75} />
                </DialogPrimitive.Close>
            )}
        </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
);

export const DialogHeader = ({
    className,
    ...props
}: ComponentProps<'div'>) => (
    <div className={cn('space-y-1.5 pr-8', className)} {...props} />
);

export const DialogFooter = ({
    className,
    ...props
}: ComponentProps<'div'>) => (
    <div
        className={cn(
            'mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
            className,
        )}
        {...props}
    />
);

export const DialogTitle = ({
    className,
    ...props
}: ComponentProps<typeof DialogPrimitive.Title>) => (
    <DialogPrimitive.Title
        className={cn(
            'text-foreground text-lg font-semibold text-balance',
            className,
        )}
        {...props}
    />
);

export const DialogDescription = ({
    className,
    ...props
}: ComponentProps<typeof DialogPrimitive.Description>) => (
    <DialogPrimitive.Description
        className={cn('text-muted text-sm text-pretty', className)}
        {...props}
    />
);
