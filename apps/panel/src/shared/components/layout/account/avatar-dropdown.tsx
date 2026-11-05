import { LogOut } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

interface AvatarDropdownProps {
    /** Único identificador legível do usuário em API-06 (`user.email`). */
    email: string;
    /** Sem handler, "Sair" fica indisponível. */
    onLogout?: () => void;
}

// Iniciais da parte local do e-mail: "ana.souza@…" → "AS", "dev@…" → "D".
const getInitials = (email: string) =>
    email
        .split('@')[0]
        .split(/[._-]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase() || '?';

export const AvatarDropdown = ({ email, onLogout }: AvatarDropdownProps) => (
    <DropdownMenu>
        <DropdownMenuTrigger
            aria-label={`Menu da conta de ${email}`}
            className="group flex size-10 shrink-0 items-center justify-center rounded-full"
        >
            {/* Botão em esmalte, mesmo material da ação principal; afunda enquanto aberto. */}
            <span
                aria-hidden="true"
                className="from-verde-escuro to-noite text-menta border-branco/10 border-t-branco/20 group-hover:from-verde-profundo group-hover:to-verde-escuro group-data-[state=open]:from-noite group-data-[state=open]:to-noite flex size-9 items-center justify-center rounded-full border bg-linear-to-b text-sm font-semibold shadow-[0_4px_10px_-4px_color-mix(in_oklab,var(--color-noite)_60%,transparent),inset_0_1px_0_color-mix(in_oklab,var(--color-branco)_14%,transparent)] transition-[translate,box-shadow,--tw-gradient-from,--tw-gradient-to] duration-200 [text-shadow:0_-1px_0_color-mix(in_oklab,var(--color-noite)_80%,black)] group-active:translate-y-px group-data-[state=open]:translate-y-px group-data-[state=open]:shadow-[inset_0_2px_4px_color-mix(in_oklab,var(--color-noite)_70%,black)]"
            >
                {getInitials(email)}
            </span>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="pb-2.5">
                <span className="text-subtle block text-xs font-normal">
                    Conectado como
                </span>
                <span className="text-foreground block truncate text-sm font-medium">
                    {email}
                </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled={!onLogout} onSelect={onLogout}>
                <LogOut aria-hidden="true" size={18} strokeWidth={1.75} />
                Sair
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
);
