import type { QueryClient } from '@tanstack/react-query';
import {
    Navigate,
    Outlet,
    createRootRouteWithContext,
} from '@tanstack/react-router';

import '../styles.css';

/** Contexto do router: disponível em todos os `loader` (ex.: `context.queryClient`). */
export interface RouterContext {
    queryClient: QueryClient;
}

const RootComponent = () => {
    return (
        <>
            <Outlet />
        </>
    );
};

export const Route = createRootRouteWithContext<RouterContext>()({
    component: RootComponent,
    notFoundComponent: () => <Navigate to="/sign-in" replace />,
});
