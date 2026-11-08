import type { QueryClient } from '@tanstack/react-query';
import {
    HeadContent,
    Navigate,
    Outlet,
    createRootRouteWithContext,
} from '@tanstack/react-router';

import '../styles.css';

/** Contexto do router: disponível em todos os `loader` (ex.: `context.queryClient`). */
export interface RouterContext {
    queryClient: QueryClient;
}

// `HeadContent` renderiza as tags de `head` das rotas; o React 19 as move para
// o `<head>`. O título da rota mais interna prevalece sobre o padrão daqui.
const RootComponent = () => {
    return (
        <>
            <HeadContent />
            <Outlet />
        </>
    );
};

export const Route = createRootRouteWithContext<RouterContext>()({
    head: () => ({
        meta: [
            { title: 'Confirma | Confirmação de agendamentos pelo WhatsApp' },
        ],
    }),
    component: RootComponent,
    notFoundComponent: () => <Navigate to="/sign-in" replace />,
});
