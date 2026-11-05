import { apiClient } from '@/shared/lib/api-client';
import type { paths } from '@/shared/@types/api';

type Response =
    paths['/invitations/{invitationToken}']['get']['responses'][200]['content']['application/json'];

export const verifyInvitation = async (invitationToken: string) => {
    const { data } = await apiClient.get<Response>(
        `/invitations/${invitationToken}`,
    );

    return data;
};
