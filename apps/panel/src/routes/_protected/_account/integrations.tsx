import { createFileRoute } from '@tanstack/react-router';
import ZApiScreen from '@/features/integrations/z-api/screens/z-api.screen';

export const Route = createFileRoute('/_protected/_account/integrations')({
    head: () => ({ meta: [{ title: 'Z-API | Confirma' }] }),
    component: ZApiScreen,
});
