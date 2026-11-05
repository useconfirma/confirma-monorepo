import { Link } from '@tanstack/react-router';
import { ArrowUpRight, BookOpen, X } from 'lucide-react';
import {
    DialogClose,
    DialogContent,
    DialogTitle,
} from '@/shared/components/ui/dialog';
import { apiClient } from '@/shared/lib/api-client';
import { cn } from '@/shared/lib/tailwind';
import { AccountNavigation } from './account-navigation';

// Referência interativa da API, servida pela própria API em `/docs`.
const docsUrl = `${apiClient.defaults.baseURL}/docs`;

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

        <div className={cn('border-t px-3 py-3', seam)}>
            <a
                href={docsUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-control text-cinza-verde-medio hover:bg-branco/4 hover:text-branco focus-visible:outline-menta flex min-h-10 items-center gap-3 px-3 text-sm font-medium transition-[color,background-color] duration-200 focus-visible:-outline-offset-2"
            >
                <BookOpen
                    aria-hidden="true"
                    size={18}
                    strokeWidth={1.75}
                    className="shrink-0"
                />
                <span className="flex-1 truncate">Documentação da API</span>
                <ArrowUpRight
                    aria-hidden="true"
                    size={16}
                    strokeWidth={1.75}
                    className="shrink-0"
                />
                <span className="sr-only">(abre em nova aba)</span>
            </a>
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
