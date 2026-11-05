import { createFileRoute } from '@tanstack/react-router';
import ApiKeyScreen from '@/features/integrations/api-key/screens/api-key.screen';

export const Route = createFileRoute('/_protected/_shell/integrations/api-key')(
    {
        component: ApiKeyScreen,
    },
);
