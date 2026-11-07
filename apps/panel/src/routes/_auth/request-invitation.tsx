import { createFileRoute } from '@tanstack/react-router';
import RequestInvitationScreen from '@/features/auth/invitations/request-invitation/screens/request-invitation.screen';

export const Route = createFileRoute('/_auth/request-invitation')({
    component: RequestInvitationScreen,
});
