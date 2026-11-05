import { Menu } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { DialogTrigger } from '@/shared/components/ui/dialog';
import { AccountBreadcrumb } from './account-breadcrumb';
import { AvatarDropdown } from './avatar-dropdown';

interface AccountHeaderProps {
    email: string;
}

// Deve ficar dentro do `Dialog` do layout: o botão de menu abre a gaveta.
export const AccountHeader = ({ email }: AccountHeaderProps) => (
    <header className="border-border flex h-16 shrink-0 items-center gap-3 border-b px-4 sm:px-6 lg:px-8">
        <DialogTrigger asChild>
            <Button
                variant="secondary"
                size="icon"
                aria-label="Abrir menu"
                className="text-muted hover:text-foreground lg:hidden"
            >
                <Menu aria-hidden="true" size={18} strokeWidth={1.75} />
            </Button>
        </DialogTrigger>

        <div className="min-w-0 flex-1">
            <AccountBreadcrumb />
        </div>

        <AvatarDropdown email={email} />
    </header>
);
