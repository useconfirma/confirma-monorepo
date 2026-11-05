import { Link, useMatchRoute } from '@tanstack/react-router';
import { ChevronDown } from 'lucide-react';
import { useId, useState } from 'react';
import { cn, tv } from '@/shared/lib/tailwind';
import {
    accountNavigation,
    type NavigationItem,
    type NavigationLink,
} from './account-navigation-items';

/*
 * Teclas sobre a placa Noite, com luz vinda de cima. A rota ativa
 * (`data-status="active"` do Link) afunda na placa e acende a lâmpada Menta:
 * o estado é comunicado por profundidade e pela lâmpada, não só pela cor.
 */
const navigationItem = tv({
    base: [
        'group rounded-control text-cinza-verde-medio relative flex w-full items-center gap-3 px-3 text-left text-sm transition-[color,background-color,box-shadow] duration-200',
        'hover:bg-branco/4 hover:text-branco hover:shadow-[inset_0_1px_0_color-mix(in_oklab,var(--color-branco)_6%,transparent)]',
        'focus-visible:outline-menta focus-visible:-outline-offset-2',
        'data-[status=active]:text-branco data-[status=active]:bg-[color-mix(in_oklab,var(--color-noite)_72%,black)] data-[status=active]:shadow-[inset_0_2px_5px_color-mix(in_oklab,var(--color-noite)_35%,black),inset_0_-1px_0_color-mix(in_oklab,var(--color-branco)_7%,transparent)]',
    ],
    variants: {
        level: {
            root: 'min-h-10 font-medium',
            child: 'min-h-9 data-[status=active]:font-medium',
        },
    },
});

// Lâmpada de "página atual". Acesa no item ativo e no grupo recolhido que o contém.
const StatusLight = ({ className }: { className?: string }) => (
    <span
        aria-hidden="true"
        className={cn(
            'bg-menta size-1.5 shrink-0 rounded-full shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-menta)_16%,transparent),0_0_8px_var(--color-menta)] transition-opacity duration-200',
            className,
        )}
    />
);

const linkStatusLight =
    'opacity-0 group-data-[status=active]:opacity-100' as const;

interface AccountNavigationProps {
    onNavigate: () => void;
}

export const AccountNavigation = ({ onNavigate }: AccountNavigationProps) => (
    <nav aria-label="Menu principal">
        <ul className="space-y-1">
            {accountNavigation.map((item) => (
                <li key={item.label}>
                    {'children' in item ? (
                        <NavigationSubmenu
                            item={item}
                            onNavigate={onNavigate}
                        />
                    ) : (
                        <Link
                            to={item.to}
                            onClick={onNavigate}
                            className={navigationItem({ level: 'root' })}
                        >
                            <item.icon
                                aria-hidden="true"
                                size={18}
                                strokeWidth={1.75}
                                className="shrink-0"
                            />
                            <span className="flex-1 truncate">
                                {item.label}
                            </span>
                            <StatusLight className={linkStatusLight} />
                        </Link>
                    )}
                </li>
            ))}
        </ul>
    </nav>
);

interface NavigationSubmenuProps {
    item: NavigationItem & { children: NavigationLink[] };
    onNavigate: () => void;
}

const NavigationSubmenu = ({ item, onNavigate }: NavigationSubmenuProps) => {
    const matchRoute = useMatchRoute();
    const listId = useId();

    const childActive = item.children.some((child) =>
        Boolean(matchRoute({ to: child.to, fuzzy: true })),
    );

    // Abre o grupo ao entrar em uma rota filha; o usuário ainda pode recolhê-lo.
    const [expanded, setExpanded] = useState(childActive);
    const [previousChildActive, setPreviousChildActive] = useState(childActive);
    if (childActive !== previousChildActive) {
        setPreviousChildActive(childActive);
        if (childActive) setExpanded(true);
    }

    return (
        <>
            <button
                type="button"
                aria-expanded={expanded}
                aria-controls={listId}
                onClick={() => setExpanded((value) => !value)}
                className={navigationItem({
                    level: 'root',
                    className: childActive && 'text-branco',
                })}
            >
                <item.icon
                    aria-hidden="true"
                    size={18}
                    strokeWidth={1.75}
                    className="shrink-0"
                />
                <span className="flex-1 truncate">{item.label}</span>
                {childActive && !expanded && (
                    <>
                        <StatusLight />
                        <span className="sr-only">, contém a página atual</span>
                    </>
                )}
                <ChevronDown
                    aria-hidden="true"
                    size={16}
                    strokeWidth={1.75}
                    className={cn(
                        'shrink-0 transition-transform duration-200',
                        expanded && 'rotate-180',
                    )}
                />
            </button>

            <div
                className={cn(
                    'ease-standard grid transition-[grid-template-rows,visibility] duration-200',
                    expanded ? 'grid-rows-[1fr]' : 'invisible grid-rows-[0fr]',
                )}
            >
                <ul
                    id={listId}
                    className="border-verde-profundo mt-1 ml-5.5 space-y-0.5 overflow-hidden border-l pl-2"
                >
                    {item.children.map((child) => (
                        <li key={child.to}>
                            <Link
                                to={child.to}
                                onClick={onNavigate}
                                className={navigationItem({ level: 'child' })}
                            >
                                <span className="flex-1 truncate">
                                    {child.label}
                                </span>
                                <StatusLight className={linkStatusLight} />
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};
