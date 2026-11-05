import { createFileRoute } from '@tanstack/react-router';
import { AccountLayout } from '@/shared/components/layout/account/account.layout';
import { ProtectedPending } from '@/shared/components/layout/protected/protected-pending';
import { accountQueryOptions } from '@/shared/hooks/use-get-account.hook';

export const Route = createFileRoute('/_protected/_account')({
    loader: async ({ context }) => {
        await context.queryClient.query(accountQueryOptions);
    },
    component: AccountLayout,
    // Exibição controlada pelo Router (`pendingMs`/`pendingMinMs` padrão).
    pendingComponent: ProtectedPending,
});
