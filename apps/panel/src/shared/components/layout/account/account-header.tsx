import { Menu } from 'lucide-react';
import type { RefObject } from 'react';
import { AccountBreadcrumb } from './account-breadcrumb';
import { AvatarDropdown } from './avatar-dropdown';

interface AccountHeaderProps {
    email: string;
    sidebarOpen: boolean;
    onOpenSidebar: () => void;
    menuButtonRef: RefObject<HTMLButtonElement | null>;
}

export const AccountHeader = ({
    email,
    sidebarOpen,
    onOpenSidebar,
    menuButtonRef,
}: AccountHeaderProps) => (
    <header className="border-border flex h-16 shrink-0 items-center gap-3 border-b px-4 sm:px-6 lg:px-8">
        {/* Controle branco em relevo; afunda ao pressionar. */}
        <button
            ref={menuButtonRef}
            type="button"
            aria-label="Abrir menu"
            aria-expanded={sidebarOpen}
            aria-controls="account-sidebar"
            onClick={onOpenSidebar}
            className="rounded-control border-border from-branco to-nevoa text-muted hover:text-foreground flex size-10 shrink-0 items-center justify-center border bg-linear-to-b shadow-[0_1px_2px_color-mix(in_oklab,var(--color-noite)_8%,transparent),inset_0_1px_0_var(--color-branco)] transition-[color,box-shadow,translate] active:translate-y-px active:shadow-[inset_0_1px_3px_color-mix(in_oklab,var(--color-noite)_14%,transparent)] lg:hidden"
        >
            <Menu aria-hidden="true" size={18} strokeWidth={1.75} />
        </button>

        <div className="min-w-0 flex-1">
            <AccountBreadcrumb />
        </div>

        <AvatarDropdown email={email} />
    </header>
);
