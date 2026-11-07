import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import type { GetAccountResponse } from '@/shared/api/get-account.api';
import { accountQueryKey } from '@/shared/hooks/use-get-account.hook';
import { updateQueryCache } from '@/shared/lib/update-query-cache';
import { configureZApi } from '../api/configure-z-api.api';
import {
    configureZApiSchema,
    type ConfigureZApiFormData,
} from '../schemas/configure-z-api.schema';

export const useConfigureZApi = () => {
    const { register, handleSubmit: formHandleSubmit } =
        useForm<ConfigureZApiFormData>({
            resolver: zodResolver(configureZApiSchema),
        });
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: configureZApi,
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
                            zApi: response,
                        },
                    };
                },
            );
        },
        // onError: () => {},
    });

    const handleSubmit = formHandleSubmit((data) => {
        mutation.mutate(data);
    });

    return { register, isPending: mutation.isPending, handleSubmit };
};
