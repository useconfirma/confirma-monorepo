import { createFileRoute } from '@tanstack/react-router';
import SignUpScreen from '@/features/auth/sign-up/screens/sign-up.screen';

export const Route = createFileRoute('/_auth/sign-up')({
    component: SignUpScreen,
});
