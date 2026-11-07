import { createFileRoute } from '@tanstack/react-router';
import InvitationScreen from '@/features/auth/invitations/invitation/screens/invitation.screen';

export const Route = createFileRoute('/_auth/invitations/$invitationToken')({
    component: InvitationScreen,
});
