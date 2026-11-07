import { useEffect, useState } from 'react';

const DESKTOP_QUERY = '(min-width: 64rem)';

/*
 * Estado da gaveta da sidebar abaixo de lg. Fecha a gaveta sozinha se a tela
 * crescer até o layout com sidebar fixa.
 */
export const useSidebarDrawer = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        const desktop = window.matchMedia(DESKTOP_QUERY);
        const onBreakpointChange = () => {
            if (desktop.matches) setIsOpen(false);
        };

        desktop.addEventListener('change', onBreakpointChange);
        return () => desktop.removeEventListener('change', onBreakpointChange);
    }, [isOpen]);

    return {
        isOpen,
        setIsOpen,
        close: () => setIsOpen(false),
    };
};
