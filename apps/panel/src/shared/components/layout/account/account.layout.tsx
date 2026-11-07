import { getRouteApi, Outlet } from '@tanstack/react-router';
import { Dialog } from '@/shared/components/ui/dialog';
import { useSidebarDrawer } from '@/shared/hooks/use-sidebar-drawer.hook';
import { AccountHeader } from './account-header';
import { AccountSidebar, AccountSidebarDrawer } from './account-sidebar';

const route = getRouteApi('/_protected/_account');

/*
 * Moldura Névoa com a placa Noite da sidebar e a folha branca do conteúdo.
 * A página não rola: só a área do Outlet rola, e header e sidebar ficam fixos.
 * Abaixo de lg a sidebar abre como gaveta modal (Dialog), que cuida de foco,
 * Esc e do bloqueio do conteúdo por trás.
 */
export const AccountLayout = () => {
    // Usuário validado pelo `beforeLoad` de `/_protected`.
    const { currentUser } = route.useRouteContext();
    const sidebarDrawer = useSidebarDrawer();

    return (
        <Dialog
            open={sidebarDrawer.isOpen}
            onOpenChange={sidebarDrawer.setIsOpen}
        >
            <div className="bg-background p-frame gap-frame flex h-dvh">
                <AccountSidebar />
                <AccountSidebarDrawer onNavigate={sidebarDrawer.close} />

                <div className="rounded-sheet bg-surface flex min-w-0 flex-1 flex-col overflow-hidden">
                    <AccountHeader email={currentUser.user.email} />

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
