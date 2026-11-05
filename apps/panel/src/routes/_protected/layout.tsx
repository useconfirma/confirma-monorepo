import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { currentUserQueryOptions } from '@/shared/hooks/use-get-current-user.hook';

export const Route = createFileRoute('/_protected')({
    loader: async ({ context }) => {
        try {
            return await context.queryClient.query(currentUserQueryOptions);
        } catch {
            throw redirect({ to: '/sign-in' });
        }
    },
    component: Outlet,
});
