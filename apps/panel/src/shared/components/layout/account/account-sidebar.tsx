import { Link } from '@tanstack/react-router';
import { X } from 'lucide-react';
import {
    DialogClose,
    DialogContent,
    DialogTitle,
} from '@/shared/components/ui/dialog';
import { cn } from '@/shared/lib/tailwind';
import { AccountNavigation } from './account-navigation';

// Junta entre faixas da placa: linha escura com reflexo claro logo abaixo.
const seam =
    'border-[color-mix(in_oklab,var(--color-noite)_55%,black)] shadow-[0_1px_0_color-mix(in_oklab,var(--color-branco)_5%,transparent)]';

/*
 * Placa Noite em esmalte: Verde-escuro no topo descendo para Noite, com
 * reflexo de 1px na borda superior.
 */
const plate =
    'rounded-sheet from-verde-escuro to-noite flex flex-col bg-linear-to-b to-35% shadow-[inset_0_1px_0_color-mix(in_oklab,var(--color-branco)_10%,transparent)]';

interface SidebarContentsProps {
    onNavigate?: () => void;
    closable?: boolean;
}

const SidebarContents = ({ onNavigate, closable }: SidebarContentsProps) => (
    <>
        <div
            className={cn(
                'flex h-16 shrink-0 items-center justify-between gap-2 border-b pr-3 pl-5',
                seam,
            )}
        >
            <Link
                to="/overview"
                onClick={onNavigate}
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
            {closable && (
                <DialogClose
                    aria-label="Fechar menu"
                    className="rounded-control text-cinza-verde-medio hover:bg-branco/4 hover:text-branco focus-visible:outline-menta flex size-10 items-center justify-center focus-visible:-outline-offset-2"
                >
                    <X aria-hidden="true" size={20} strokeWidth={1.75} />
                </DialogClose>
            )}
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
            <AccountNavigation onNavigate={onNavigate} />
        </div>

        <div className={cn('border-t px-5 py-4 text-xs', seam)}>
            <p className="text-branco font-medium">Beta fechado</p>
            <p className="text-cinza-verde-medio mt-0.5">
                Use apenas dados fictícios.
            </p>
        </div>
    </>
);

// Em lg+ a placa ocupa a coluna esquerda do layout.
export const AccountSidebar = () => (
    <aside
        aria-label="Barra lateral"
        className={cn(plate, 'w-60 shrink-0 max-lg:hidden xl:w-64')}
    >
        <SidebarContents />
    </aside>
);

/*
 * Abaixo de lg a mesma placa vira gaveta modal sobre o conteúdo. Deve ficar
 * dentro do `Dialog` do layout, que também envolve o botão que a abre.
 */
export const AccountSidebarDrawer = ({
    onNavigate,
}: {
    onNavigate: () => void;
}) => (
    <DialogContent
        variant="drawer"
        aria-describedby={undefined}
        className={cn(
            plate,
            'shadow-[inset_0_1px_0_color-mix(in_oklab,var(--color-branco)_10%,transparent),0_24px_48px_-12px_color-mix(in_oklab,var(--color-noite)_60%,transparent)] lg:hidden',
        )}
    >
        <DialogTitle className="sr-only">Menu</DialogTitle>
        <SidebarContents onNavigate={onNavigate} closable />
    </DialogContent>
);
