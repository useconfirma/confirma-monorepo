import { createFileRoute } from '@tanstack/react-router';
import WelcomeScreen from '@/features/accounts/welcome/screens/welcome.screen';

export const Route = createFileRoute('/_protected/welcome')({
    head: () => ({ meta: [{ title: 'Boas-vindas | Confirma' }] }),
    component: WelcomeScreen,
});
