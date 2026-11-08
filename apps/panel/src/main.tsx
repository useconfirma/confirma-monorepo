import { useQueryClient } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { routeTree } from './routeTree.gen';
import { QueryProvider } from './shared/providers/query-provider';
import { ToastProvider } from './shared/providers/toast-provider';

const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true,
    // Área rolável do AccountLayout: volta ao topo a cada navegação.
    scrollToTopSelectors: ['#account-content'],
    context: { queryClient: undefined! },
});

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

const App = () => {
    const queryClient = useQueryClient();
    return <RouterProvider router={router} context={{ queryClient }} />;
};

ReactDOM.createRoot(document.getElementById('app')!).render(
    <StrictMode>
        <QueryProvider>
            <ToastProvider>
                <App />
            </ToastProvider>
        </QueryProvider>
    </StrictMode>,
);
