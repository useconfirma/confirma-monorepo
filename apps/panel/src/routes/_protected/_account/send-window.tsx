import { createFileRoute } from '@tanstack/react-router';
import SendWindowScreen from '@/features/integrations/send-window/screens/send-window.screen';

export const Route = createFileRoute('/_protected/_account/send-window')({
    component: SendWindowScreen,
});
