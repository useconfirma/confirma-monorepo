import { createFileRoute } from '@tanstack/react-router';
import WelcomeScreen from '@/features/auth/welcome/screens/welcome.screen';

export const Route = createFileRoute('/_protected/welcome')({
    component: WelcomeScreen,
});
