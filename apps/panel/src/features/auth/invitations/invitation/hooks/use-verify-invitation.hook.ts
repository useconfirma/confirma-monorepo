import { queryOptions, useQuery } from '@tanstack/react-query';
import { verifyInvitation } from '../api/verify-invitation.api';

export const verifyInvitationQueryKey = (invitationToken: string) =>
    ['invitations', invitationToken] as const;

export const verifyInvitationQueryOptions = (invitationToken: string) =>
    queryOptions({
        queryKey: verifyInvitationQueryKey(invitationToken),
        queryFn: () => verifyInvitation(invitationToken),
    });

export const useVerifyInvitation = (invitationToken: string) => {
    return useQuery(verifyInvitationQueryOptions(invitationToken));
};
