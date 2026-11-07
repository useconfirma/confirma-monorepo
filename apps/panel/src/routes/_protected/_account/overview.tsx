import { createFileRoute } from '@tanstack/react-router';
import OverviewScreen from '@/features/accounts/overview/screens/overview.screen';

export const Route = createFileRoute('/_protected/_account/overview')({
    component: OverviewScreen,
});
