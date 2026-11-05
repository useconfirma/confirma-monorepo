import { apiClient } from '@/shared/lib/api-client';
import type { paths } from '@/shared/@types/api';

type Body = NonNullable<
    paths['/integration/webhook']['put']['requestBody']
>['content']['application/json'];
type Response =
    paths['/integration/webhook']['put']['responses'][200]['content']['application/json'];

export const configureWebhook = async (data: Body) => {
    const { data: response } = await apiClient.put<Response>(
        '/integration/webhook',
        data,
    );

    return response;
};
