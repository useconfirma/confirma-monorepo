import { createFileRoute } from '@tanstack/react-router';
import ShellLayout from '@/shared/components/layout/shell/shell.layout';

export const Route = createFileRoute('/_protected/_shell')({
    component: ShellLayout,
});
