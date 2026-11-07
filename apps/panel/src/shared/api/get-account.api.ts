import { apiClient } from '@/shared/lib/api-client';
import type { paths } from '@/shared/@types/api';

type Response =
    paths['/account']['get']['responses'][200]['content']['application/json'];

export type GetAccountResponse = Response;

export const getAccount = async () => {
    const { data } = await apiClient.get<Response>('/account');

    return data;
};
