import { LogOut } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { cn } from '@/shared/lib/tailwind';

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

export const AvatarDropdown = ({ email, onLogout }: AvatarDropdownProps) => {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const menuId = useId();

    const getItems = () =>
        Array.from(
            menuRef.current?.querySelectorAll<HTMLElement>(
                '[role="menuitem"]',
            ) ?? [],
        );

    const close = () => {
        setOpen(false);
        triggerRef.current?.focus();
    };

    useEffect(() => {
        if (!open) return;

        getItems()[0]?.focus();

        const onPointerDown = (event: PointerEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('pointerdown', onPointerDown);
        return () => document.removeEventListener('pointerdown', onPointerDown);
    }, [open]);

    const onTriggerKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            setOpen(true);
        }
    };

    const onMenuKeyDown = (event: KeyboardEvent) => {
        const items = getItems();
        const index = items.indexOf(document.activeElement as HTMLElement);
        const focusAt = (next: number) =>
            items[(next + items.length) % items.length]?.focus();

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                focusAt(index + 1);
                break;
            case 'ArrowUp':
                event.preventDefault();
                focusAt(index - 1);
                break;
            case 'Home':
                event.preventDefault();
                focusAt(0);
                break;
            case 'End':
                event.preventDefault();
                focusAt(items.length - 1);
                break;
            case 'Escape':
                event.preventDefault();
                close();
                break;
            case 'Tab':
                setOpen(false);
                break;
        }
    };

    const handleLogout = () => {
        if (!onLogout) return;
        setOpen(false);
        onLogout();
    };

    return (
        <div ref={rootRef} className="relative shrink-0">
            <button
                ref={triggerRef}
                type="button"
                aria-haspopup="menu"
                aria-expanded={open}
                aria-controls={open ? menuId : undefined}
                aria-label={`Menu da conta de ${email}`}
                onClick={() => setOpen((value) => !value)}
                onKeyDown={onTriggerKeyDown}
                className="group flex size-10 items-center justify-center rounded-full"
            >
                {/* Botão em esmalte, mesmo material da ação principal; afunda enquanto aberto. */}
                <span
                    aria-hidden="true"
                    className="from-verde-escuro to-noite text-menta border-branco/10 border-t-branco/20 group-hover:from-verde-profundo group-hover:to-verde-escuro group-aria-expanded:from-noite group-aria-expanded:to-noite flex size-9 items-center justify-center rounded-full border bg-linear-to-b text-sm font-semibold shadow-[0_4px_10px_-4px_color-mix(in_oklab,var(--color-noite)_60%,transparent),inset_0_1px_0_color-mix(in_oklab,var(--color-branco)_14%,transparent)] transition-[translate,box-shadow,--tw-gradient-from,--tw-gradient-to] duration-200 [text-shadow:0_-1px_0_color-mix(in_oklab,var(--color-noite)_80%,black)] group-active:translate-y-px group-aria-expanded:translate-y-px group-aria-expanded:shadow-[inset_0_2px_4px_color-mix(in_oklab,var(--color-noite)_70%,black)]"
                >
                    {getInitials(email)}
                </span>
            </button>

            {open && (
                <div
                    ref={menuRef}
                    id={menuId}
                    role="menu"
                    aria-label={`Conta de ${email}`}
                    onKeyDown={onMenuKeyDown}
                    className="rounded-card border-border bg-surface shadow-popover motion-safe:animate-scale-in absolute top-full right-0 z-(--z-dropdown) mt-2 w-64 max-w-[calc(100vw-2rem)] origin-top-right border p-1"
                >
                    <div
                        role="none"
                        className="border-border mb-1 border-b px-3 pt-2 pb-2.5"
                    >
                        <p className="text-subtle text-xs">Conectado como</p>
                        <p className="text-foreground truncate text-sm font-medium">
                            {email}
                        </p>
                    </div>

                    <button
                        type="button"
                        role="menuitem"
                        tabIndex={-1}
                        aria-disabled={!onLogout || undefined}
                        onClick={handleLogout}
                        className={cn(
                            'rounded-control text-foreground hover:bg-surface-muted focus-visible:bg-surface-muted flex min-h-10 w-full items-center gap-3 px-3 text-left text-sm focus-visible:-outline-offset-2',
                            !onLogout && 'text-disabled hover:bg-transparent',
                        )}
                    >
                        <LogOut
                            aria-hidden="true"
                            size={18}
                            strokeWidth={1.75}
                            className="shrink-0"
                        />
                        Sair
                    </button>
                </div>
            )}
        </div>
    );
};
