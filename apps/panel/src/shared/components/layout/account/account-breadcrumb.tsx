import { useMatchRoute } from '@tanstack/react-router';
import { accountNavigation } from './account-navigation-items';

/*
 * Trilha derivada da navegação do painel e da rota casada pelo Router, de
 * modo que segmentos técnicos da URL nunca aparecem como texto. Grupos sem
 * página própria aparecem como texto, sem link.
 */
const useBreadcrumbTrail = () => {
    const matchRoute = useMatchRoute();

    for (const item of accountNavigation) {
        if ('children' in item) {
            const child = item.children.find((link) =>
                matchRoute({ to: link.to, fuzzy: true }),
            );
            if (child) return [item.label, child.label];
        } else if (matchRoute({ to: item.to, fuzzy: true })) {
            return [item.label];
        }
    }

    return [];
};

export const AccountBreadcrumb = () => {
    const trail = useBreadcrumbTrail();

    if (trail.length === 0) return null;

    return (
        <nav aria-label="Você está em" className="min-w-0">
            <ol className="flex min-w-0 items-center gap-2 text-sm">
                {trail.map((label, index) => {
                    const current = index === trail.length - 1;

                    return current ? (
                        <li key={label} className="min-w-0">
                            <span
                                aria-current="page"
                                className="text-foreground block truncate font-medium"
                            >
                                {label}
                            </span>
                        </li>
                    ) : (
                        // Em telas pequenas só a página atual permanece.
                        <li
                            key={label}
                            className="text-muted hidden shrink-0 items-center gap-2 sm:flex"
                        >
                            {label}
                            <span aria-hidden="true" className="text-disabled">
                                /
                            </span>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};
