import { apiClient } from '@/shared/lib/api-client';
import type { paths } from '@/shared/@types/api';

type Body = NonNullable<
    paths['/integration/send-window']['put']['requestBody']
>['content']['application/json'];
type Response =
    paths['/integration/send-window']['put']['responses'][200]['content']['application/json'];

export const configureSendWindow = async (data: Body) => {
    const { data: response } = await apiClient.put<Response>(
        '/integration/send-window',
        data,
    );

    return response;
};
