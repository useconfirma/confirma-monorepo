import { useMutation } from '@tanstack/react-query';
import { acceptInvitation } from '../api/accept-invitation.api';

export const useAcceptInvitation = () => {
    return useMutation({ mutationFn: acceptInvitation });
};
