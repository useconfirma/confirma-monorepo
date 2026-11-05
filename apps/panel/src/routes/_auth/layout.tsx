import { createFileRoute } from '@tanstack/react-router';
import AuthLayout from '@/shared/components/layout/auth/auth.layout';

export const Route = createFileRoute('/_auth')({
    component: AuthLayout,
});
