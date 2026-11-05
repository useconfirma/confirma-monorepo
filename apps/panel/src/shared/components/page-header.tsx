import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/tailwind';

interface PageHeaderProps {
    title: string;
    description?: ReactNode;
    actions?: ReactNode;
    className?: string;
}

/*
 * Cabeçalho das páginas das rotas protegidas. O breadcrumb do layout já diz
 * onde a pessoa está; aqui fica só o título da página (o único h1), uma
 * frase sobre o que ela controla nesta tela e as ações da página.
 * Em telas pequenas as ações descem para baixo do texto.
 */
export const PageHeader = ({
    title,
    description,
    actions,
    className,
}: PageHeaderProps) => (
    <header
        className={cn(
            'mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6',
            className,
        )}
    >
        <div className="min-w-0 space-y-1.5">
            <h1 className="text-foreground text-2xl font-semibold text-balance">
                {title}
            </h1>
            {description && (
                <p className="text-muted max-w-[60ch] text-sm text-pretty sm:text-base">
                    {description}
                </p>
            )}
        </div>

        {actions && (
            <div className="flex shrink-0 flex-wrap items-center gap-2">
                {actions}
            </div>
        )}
    </header>
);
