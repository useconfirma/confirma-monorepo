import { createFileRoute, redirect } from '@tanstack/react-router';
import { InvitationError } from '@/features/auth/invitations/invitation/components/invitation-error';
import { verifyInvitationQueryOptions } from '@/features/auth/invitations/invitation/hooks/use-verify-invitation.hook';
import InvitationScreen from '@/features/auth/invitations/invitation/screens/invitation.screen';

export const Route = createFileRoute('/_auth/invitations/$invitationToken')({
    // Sem token redireciona para o login; convite inválido estoura para o `errorComponent`.
    beforeLoad: async ({ context, params }) => {
        if (!params.invitationToken) {
            throw redirect({ to: '/sign-in', replace: true });
        }

        const { email } = await context.queryClient.query({
            ...verifyInvitationQueryOptions(params.invitationToken),
        });

        return { invitationToken: params.invitationToken, email };
    },
    head: () => ({ meta: [{ title: 'Criar sua conta | Confirma' }] }),
    component: InvitationScreen,
    errorComponent: InvitationError,
});
