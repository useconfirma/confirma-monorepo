import { createFileRoute } from '@tanstack/react-router';
import WebhookScreen from '@/features/integrations/webhook/screens/webhook.screen';

export const Route = createFileRoute('/_protected/_account/webhook')({
    head: () => ({ meta: [{ title: 'Webhook | Confirma' }] }),
    component: WebhookScreen,
});
