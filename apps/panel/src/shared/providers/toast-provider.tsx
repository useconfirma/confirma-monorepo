import {
    CircleAlert,
    CircleCheck,
    Info,
    LoaderCircle,
    TriangleAlert,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';

/*
 * Toasts do painel: folha Noite sobre a moldura clara, com o estado no ícone
 * e no texto. Menta marca a confirmação, por ser a única cor de destaque
 * permitida sobre Noite. O Sonner roda em modo `unstyled`; o CSS que ele
 * injeta fica fora das camadas do Tailwind, por isso o foco usa `!`.
 *
 * Dispare com `toast.success('Webhook salvo.')`, importando `toast` de
 * `sonner`.
 */

const iconProps = {
    'aria-hidden': true,
    size: 16,
    strokeWidth: 2,
} as const;

const icons = {
    success: <CircleCheck {...iconProps} className="text-menta" />,
    error: <CircleAlert {...iconProps} className="text-coral" />,
    warning: <TriangleAlert {...iconProps} className="text-ambar" />,
    info: <Info {...iconProps} className="text-cinza-verde-medio" />,
    loading: (
        <LoaderCircle
            {...iconProps}
            className="text-cinza-verde-medio motion-safe:animate-spin"
        />
    ),
};

const classNames = {
    toast: [
        'rounded-card bg-noite text-branco shadow-dialog border-verde-profundo flex w-(--width) items-start gap-3 border p-4 font-sans',
        'focus-visible:outline-ring! focus-visible:outline-2! focus-visible:outline-offset-2! focus-visible:outline-solid!',
    ].join(' '),
    icon: 'mt-0.5 flex size-4 shrink-0 items-center justify-center',
    content: 'flex min-w-0 flex-1 flex-col gap-0.5',
    title: 'text-sm font-medium text-pretty',
    description: 'text-cinza-verde-medio text-sm text-pretty',
    actionButton:
        'rounded-control bg-menta text-noite hover:bg-verde-claro -my-1 h-8 shrink-0 cursor-pointer px-3 text-sm font-medium transition-colors',
    cancelButton:
        'rounded-control text-cinza-verde-medio hover:bg-verde-escuro hover:text-branco -my-1 h-8 shrink-0 cursor-pointer px-3 text-sm font-medium transition-colors',
};

export const ToastProvider = ({ children }: { children: ReactNode }) => (
    <>
        {children}
        <Toaster
            position="bottom-right"
            gap={8}
            icons={icons}
            containerAriaLabel="Notificações"
            style={{ zIndex: 'var(--z-toast)' }}
            toastOptions={{ unstyled: true, classNames }}
        />
    </>
);
