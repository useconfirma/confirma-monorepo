import { Link } from '@tanstack/react-router';
import { X } from 'lucide-react';
import type { RefObject } from 'react';
import { cn } from '@/shared/lib/tailwind';
import { AccountNavigation } from './account-navigation';

interface AccountSidebarProps {
    open: boolean;
    onClose: () => void;
    closeButtonRef: RefObject<HTMLButtonElement | null>;
}

// Junta entre faixas da placa: linha escura com reflexo claro logo abaixo.
const seam =
    'border-[color-mix(in_oklab,var(--color-noite)_55%,black)] shadow-[0_1px_0_color-mix(in_oklab,var(--color-branco)_5%,transparent)]';

/*
 * Placa Noite em esmalte: Verde-escuro no topo descendo para Noite, com
 * reflexo de 1px na borda superior. Em lg+ ocupa a coluna esquerda; abaixo
 * disso vira painel temporário sobre o conteúdo, fora da ordem de foco
 * enquanto fechado.
 */
export const AccountSidebar = ({
    open,
    onClose,
    closeButtonRef,
}: AccountSidebarProps) => (
    <aside
        id="account-sidebar"
        aria-label="Barra lateral"
        className={cn(
            'rounded-sheet from-verde-escuro to-noite flex w-60 shrink-0 flex-col bg-linear-to-b to-35% shadow-[inset_0_1px_0_color-mix(in_oklab,var(--color-branco)_10%,transparent)] xl:w-64',
            'max-lg:inset-y-frame max-lg:left-frame max-lg:ease-standard max-lg:fixed max-lg:z-(--z-dialog) max-lg:w-72 max-lg:max-w-[calc(100vw-3rem)] max-lg:shadow-[inset_0_1px_0_color-mix(in_oklab,var(--color-branco)_10%,transparent),0_24px_48px_-12px_color-mix(in_oklab,var(--color-noite)_60%,transparent)] max-lg:transition-[translate,visibility] max-lg:duration-200',
            open
                ? 'max-lg:translate-x-0'
                : 'max-lg:invisible max-lg:-translate-x-[calc(100%+1rem)]',
        )}
    >
        <div
            className={cn(
                'flex h-16 shrink-0 items-center justify-between gap-2 border-b pr-3 pl-5',
                seam,
            )}
        >
            <Link
                to="/overview"
                onClick={onClose}
                className="focus-visible:outline-menta rounded-xs"
            >
                <img
                    src="/confirma-logo-branco.svg"
                    alt="Confirma"
                    width={83}
                    height={32}
                    className="h-8 w-auto"
                />
            </Link>
            <button
                ref={closeButtonRef}
                type="button"
                aria-label="Fechar menu"
                onClick={onClose}
                className="rounded-control text-cinza-verde-medio hover:bg-branco/4 hover:text-branco focus-visible:outline-menta flex size-10 items-center justify-center focus-visible:-outline-offset-2 lg:hidden"
            >
                <X aria-hidden="true" size={20} strokeWidth={1.75} />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
            <AccountNavigation onNavigate={onClose} />
        </div>

        <div className={cn('border-t px-5 py-4 text-xs', seam)}>
            <p className="text-branco font-medium">Beta fechado</p>
            <p className="text-cinza-verde-medio mt-0.5">
                Use apenas dados fictícios.
            </p>
        </div>
    </aside>
);
