import { createFileRoute } from '@tanstack/react-router';
import WebhookScreen from '@/features/account/webhook/screens/webhook.screen';

export const Route = createFileRoute('/_protected/_account/webhook')({
    component: WebhookScreen,
});
