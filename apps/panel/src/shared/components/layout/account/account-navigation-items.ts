import { LayoutGrid, Plug, type LucideIcon } from 'lucide-react';
import type { FileRouteTypes } from '@/routeTree.gen';

type RoutePath = FileRouteTypes['to'];

export interface NavigationLink {
    label: string;
    to: RoutePath;
}

export type NavigationItem = {
    label: string;
    icon: LucideIcon;
} & ({ to: RoutePath } | { children: NavigationLink[] });

/*
 * Fonte única da navegação do painel: alimenta a sidebar e o breadcrumb.
 * "Integração" agrupa os blocos de ENT-03 (UC-07 a UC-10) e não tem página
 * própria.
 */
export const accountNavigation: NavigationItem[] = [
    { label: 'Visão geral', to: '/overview', icon: LayoutGrid },
    {
        label: 'Integração',
        icon: Plug,
        children: [
            { label: 'API Key', to: '/api-key' },
            { label: 'Webhook', to: '/webhook' },
            { label: 'Janela de envio', to: '/send-window' },
            { label: 'Z-API', to: '/integrations' },
        ],
    },
];
