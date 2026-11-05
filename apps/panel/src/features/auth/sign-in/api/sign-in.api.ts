import { apiClient } from '@/shared/lib/api-client';
import type { paths } from '@/shared/@types/api';

type Body = NonNullable<
    paths['/sessions']['post']['requestBody']
>['content']['application/json'];

export const signIn = async (data: Body) => {
    await apiClient.post('/sessions', data);
};
