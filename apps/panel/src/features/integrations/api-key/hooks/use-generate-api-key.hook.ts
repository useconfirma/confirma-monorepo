import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { GetAccountResponse } from '@/shared/api/get-account.api';
import { accountQueryKey } from '@/shared/hooks/use-get-account.hook';
import { updateQueryCache } from '@/shared/lib/update-query-cache';
import { generateApiKey } from '../api/generate-api-key.api';

export const useGenerateApiKey = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: generateApiKey,
        onSuccess: (response) => {
            updateQueryCache<GetAccountResponse>(
                queryClient,
                accountQueryKey,
                (currentData) => {
                    if (!currentData) return currentData;

                    return {
                        ...currentData,
                        account: {
                            ...currentData.account,
                            apiKey: {
                                configured: true,
                                createdAt: response.createdAt,
                            },
                        },
                    };
                },
            );
        },
        // onError: () => {},
    });
};
