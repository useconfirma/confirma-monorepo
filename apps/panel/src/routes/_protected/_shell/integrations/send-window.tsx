import { createFileRoute } from '@tanstack/react-router';
import SendWindowScreen from '@/features/integrations/send-window/screens/send-window.screen';

export const Route = createFileRoute(
    '/_protected/_shell/integrations/send-window',
)({
    component: SendWindowScreen,
});
