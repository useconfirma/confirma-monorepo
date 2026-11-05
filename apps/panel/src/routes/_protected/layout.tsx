import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import { ProtectedPending } from '@/shared/components/layout/protected/protected-pending';
import { currentUserQueryOptions } from '@/shared/hooks/use-get-current-user.hook';

export const Route = createFileRoute('/_protected')({
    // Valida a sessão e deixa o usuário atual no cache do TanStack Query.
    beforeLoad: async ({ context }) => {
        try {
            await context.queryClient.query(currentUserQueryOptions);
        } catch {
            throw redirect({ to: '/sign-in', replace: true });
        }
    },
    component: Outlet,
    // Exibição controlada pelo Router (`pendingMs`/`pendingMinMs` padrão).
    pendingComponent: ProtectedPending,
});
