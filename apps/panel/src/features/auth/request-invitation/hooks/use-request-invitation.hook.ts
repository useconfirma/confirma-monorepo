import { useMutation } from '@tanstack/react-query';
import { requestInvitation } from '../api/request-invitation.api';

export const useRequestInvitation = () => {
    return useMutation({ mutationFn: requestInvitation });
};
