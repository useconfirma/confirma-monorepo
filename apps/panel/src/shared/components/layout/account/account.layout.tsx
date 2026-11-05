import { Outlet } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/shared/lib/tailwind';
import { AccountHeader } from './account-header';
import { AccountSidebar } from './account-sidebar';

// TEMPORÁRIO: e-mail demonstrativo no formato de API-06 (`user.email`).
// Substituir pelo usuário autenticado ao integrar a sessão ao layout.
const DEMO_USER_EMAIL = 'dev@example.com';

const DESKTOP_QUERY = '(min-width: 64rem)';

/*
 * Moldura Névoa com a placa Noite da sidebar e a folha branca do conteúdo.
 * A página não rola: só a área do Outlet rola, e header e sidebar ficam fixos.
 */
export const AccountLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const wasOpen = useRef(false);

    useEffect(() => {
        if (!sidebarOpen) {
            // Devolve o foco ao botão que abriu o menu.
            if (wasOpen.current) menuButtonRef.current?.focus();
            wasOpen.current = false;
            return;
        }

        wasOpen.current = true;
        closeButtonRef.current?.focus();

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setSidebarOpen(false);
        };
        const desktop = window.matchMedia(DESKTOP_QUERY);
        const onBreakpointChange = () => {
            if (desktop.matches) setSidebarOpen(false);
        };

        document.addEventListener('keydown', onKeyDown);
        desktop.addEventListener('change', onBreakpointChange);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            desktop.removeEventListener('change', onBreakpointChange);
        };
    }, [sidebarOpen]);

    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="bg-background p-frame gap-frame flex h-dvh">
            <AccountSidebar
                open={sidebarOpen}
                onClose={closeSidebar}
                closeButtonRef={closeButtonRef}
            />

            <div
                aria-hidden="true"
                onClick={closeSidebar}
                className={cn(
                    'bg-overlay fixed inset-0 z-(--z-overlay) transition-opacity duration-200 lg:hidden',
                    sidebarOpen
                        ? 'opacity-100'
                        : 'pointer-events-none opacity-0',
                )}
            />

            <div
                inert={sidebarOpen}
                className="rounded-sheet bg-surface flex min-w-0 flex-1 flex-col overflow-hidden"
            >
                <AccountHeader
                    email={DEMO_USER_EMAIL}
                    sidebarOpen={sidebarOpen}
                    onOpenSidebar={() => setSidebarOpen(true)}
                    menuButtonRef={menuButtonRef}
                />

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
    );
};
