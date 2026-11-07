import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import { ProtectedPending } from '@/shared/components/layout/protected/protected-pending';
import { currentUserQueryOptions } from '@/shared/hooks/use-get-current-user.hook';

export const Route = createFileRoute('/_protected')({
    // Valida a sessão, deixa o usuário atual no cache do TanStack Query e o
    // expõe no contexto das rotas filhas.
    beforeLoad: async ({ context }) => {
        const currentUser = await context.queryClient
            .query({
                ...currentUserQueryOptions,
                staleTime: 'static',
            })
            .catch(() => {
                throw redirect({ to: '/sign-in', replace: true });
            });

        return { currentUser };
    },
    component: Outlet,
    // Exibição controlada pelo Router (`pendingMs`/`pendingMinMs` padrão).
    pendingComponent: ProtectedPending,
});
