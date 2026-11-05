import { useQueryClient } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { routeTree } from './routeTree.gen';
import { QueryProvider } from './shared/providers/query-provider';

const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true,
    context: { queryClient: undefined! },
});

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

ReactDOM.createRoot(document.getElementById('app')!).render(
    <StrictMode>
        <QueryProvider>
            <RouterProvider
                router={router}
                context={{ queryClient: useQueryClient() }}
            />
        </QueryProvider>
    </StrictMode>,
);
