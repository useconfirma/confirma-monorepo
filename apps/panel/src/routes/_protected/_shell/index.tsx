import { createFileRoute } from '@tanstack/react-router';
import AccountScreen from '@/features/accounts/account/screens/account.screen';

export const Route = createFileRoute('/_protected/_shell/')({
    component: AccountScreen,
});
