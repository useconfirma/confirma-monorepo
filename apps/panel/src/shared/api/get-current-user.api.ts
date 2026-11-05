import { apiClient } from '@/shared/lib/api-client';
import type { paths } from '@/shared/@types/api';

type Response =
    paths['/users/me']['get']['responses'][200]['content']['application/json'];

export const getCurrentUser = async () => {
    const { data } = await apiClient.get<Response>('/users/me');

    return data;
};
