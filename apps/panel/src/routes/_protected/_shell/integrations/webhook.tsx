import { createFileRoute } from '@tanstack/react-router';
import WebhookScreen from '@/features/integrations/webhook/screens/webhook.screen';

export const Route = createFileRoute('/_protected/_shell/integrations/webhook')(
    {
        component: WebhookScreen,
    },
);
