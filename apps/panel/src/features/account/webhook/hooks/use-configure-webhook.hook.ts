import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import type { GetAccountResponse } from '@/shared/api/get-account.api';
import { accountQueryKey } from '@/shared/hooks/use-get-account.hook';
import { updateQueryCache } from '@/shared/lib/update-query-cache';
import { configureWebhook } from '../api/configure-webhook.api';
import {
    configureWebhookSchema,
    type ConfigureWebhookFormData,
} from '../schemas/configure-webhook.schema';

export const useConfigureWebhook = () => {
    const { register, handleSubmit: formHandleSubmit } =
        useForm<ConfigureWebhookFormData>({
            resolver: zodResolver(configureWebhookSchema),
        });
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: configureWebhook,
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
                            webhook: response,
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
