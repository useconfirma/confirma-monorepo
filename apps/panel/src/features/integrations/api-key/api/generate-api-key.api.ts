import { apiClient } from '@/shared/lib/api-client';
import type { paths } from '@/shared/@types/api';

type Response =
    paths['/integration/api-key']['post']['responses'][201]['content']['application/json'];

export const generateApiKey = async () => {
    const { data } = await apiClient.post<Response>('/integration/api-key');

    return data;
};
