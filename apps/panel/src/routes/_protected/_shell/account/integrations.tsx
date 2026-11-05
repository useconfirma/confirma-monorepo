import { createFileRoute } from '@tanstack/react-router';
import IntegrationsScreen from '@/features/account/integrations/screens/integrations.screen';

export const Route = createFileRoute('/_protected/_shell/account/integrations')(
    {
        component: IntegrationsScreen,
    },
);
