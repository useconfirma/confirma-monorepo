import { apiClient } from '@/shared/lib/api-client';
import type { paths } from '@/shared/@types/api';

type Body = NonNullable<
    paths['/accounts']['post']['requestBody']
>['content']['application/json'];

export const acceptInvitation = async (data: Body) => {
    await apiClient.post('/accounts', data);
};
