import { Outlet } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Dialog } from '@/shared/components/ui/dialog';
import { AccountHeader } from './account-header';
import { AccountSidebar, AccountSidebarDrawer } from './account-sidebar';

// TEMPORÁRIO: e-mail demonstrativo no formato de API-06 (`user.email`).
// Substituir pelo usuário autenticado ao integrar a sessão ao layout.
const DEMO_USER_EMAIL = 'dev@example.com';

const DESKTOP_QUERY = '(min-width: 64rem)';

/*
 * Moldura Névoa com a placa Noite da sidebar e a folha branca do conteúdo.
 * A página não rola: só a área do Outlet rola, e header e sidebar ficam fixos.
 * Abaixo de lg a sidebar abre como gaveta modal (Dialog), que cuida de foco,
 * Esc e do bloqueio do conteúdo por trás.
 */
export const AccountLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Fecha a gaveta se a tela crescer até o layout com sidebar fixa.
    useEffect(() => {
        if (!sidebarOpen) return;

        const desktop = window.matchMedia(DESKTOP_QUERY);
        const onBreakpointChange = () => {
            if (desktop.matches) setSidebarOpen(false);
        };

        desktop.addEventListener('change', onBreakpointChange);
        return () => desktop.removeEventListener('change', onBreakpointChange);
    }, [sidebarOpen]);

    return (
        <Dialog open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <div className="bg-background p-frame gap-frame flex h-dvh">
                <AccountSidebar />
                <AccountSidebarDrawer
                    onNavigate={() => setSidebarOpen(false)}
                />

                <div className="rounded-sheet bg-surface flex min-w-0 flex-1 flex-col overflow-hidden">
                    <AccountHeader email={DEMO_USER_EMAIL} />

                    <main
                        id="account-content"
                        data-scroll-restoration-id="account-content"
                        className="flex-1 overflow-y-auto"
                    >
                        <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </Dialog>
    );
};
