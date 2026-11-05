import { apiClient } from '@/shared/lib/api-client';
import type { paths } from '@/shared/@types/api';

type Body = NonNullable<
    paths['/integration/z-api']['put']['requestBody']
>['content']['application/json'];
type Response =
    paths['/integration/z-api']['put']['responses'][200]['content']['application/json'];

export const configureZApi = async (data: Body) => {
    const { data: response } = await apiClient.put<Response>(
        '/integration/z-api',
        data,
    );

    return response;
};
