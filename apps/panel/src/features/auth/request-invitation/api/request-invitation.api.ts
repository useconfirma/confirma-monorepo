import { apiClient } from '@/shared/lib/api-client';
import type { paths } from '@/shared/@types/api';

type Body = NonNullable<
    paths['/invitations']['post']['requestBody']
>['content']['application/json'];

export const requestInvitation = async (data: Body) => {
    await apiClient.post('/invitations', data);
};
