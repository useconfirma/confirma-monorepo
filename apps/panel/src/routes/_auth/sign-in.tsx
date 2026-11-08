import { createFileRoute } from '@tanstack/react-router';
import SignInScreen from '@/features/auth/sign-in/screens/sign-in.screen';

export const Route = createFileRoute('/_auth/sign-in')({
    head: () => ({ meta: [{ title: 'Entrar no painel | Confirma' }] }),
    component: SignInScreen,
});
