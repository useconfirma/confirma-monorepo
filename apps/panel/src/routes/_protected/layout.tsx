import { createFileRoute } from '@tanstack/react-router';
import ProtectedLayout from '@/shared/components/layout/protected/protected.layout';

export const Route = createFileRoute('/_protected')({
    component: ProtectedLayout,
});
