import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { GetAccountResponse } from '@/shared/api/get-account.api';
import { accountQueryKey } from '@/shared/hooks/use-get-account.hook';
import { updateQueryCache } from '@/shared/lib/update-query-cache';
import { generateApiKey } from '../api/generate-api-key.api';

/*
 * Gera a API Key (API-08). O cache da account recebe só `configured` e
 * `createdAt`; o valor da chave fica apenas no resultado desta mutation,
 * exposto como `generatedApiKey`, e é descartado por `reset`.
 */
export const useGenerateApiKey = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
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

    const generate = () => {
        mutation.mutate();
    };

    // Descarta a chave gerada depois que o diálogo é fechado.
    const reset = () => {
        mutation.reset();
    };

    return {
        generate,
        isPending: mutation.isPending,
        isError: mutation.isError,
        generatedApiKey: mutation.data?.apiKey ?? null,
        reset,
    };
};
