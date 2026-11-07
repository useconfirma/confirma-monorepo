import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import type { GetAccountResponse } from '@/shared/api/get-account.api';
import { accountQueryKey } from '@/shared/hooks/use-get-account.hook';
import { updateQueryCache } from '@/shared/lib/update-query-cache';
import { configureSendWindow } from '../api/configure-send-window.api';
import {
    configureSendWindowSchema,
    type ConfigureSendWindowFormData,
} from '../schemas/configure-send-window.schema';

export const useConfigureSendWindow = () => {
    const { register, handleSubmit: formHandleSubmit } =
        useForm<ConfigureSendWindowFormData>({
            resolver: zodResolver(configureSendWindowSchema),
        });
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: configureSendWindow,
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
                            sendWindow: response,
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
