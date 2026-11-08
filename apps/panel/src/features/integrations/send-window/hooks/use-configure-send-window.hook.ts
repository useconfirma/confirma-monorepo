import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { paths } from '@/shared/@types/api';
import type { GetAccountResponse } from '@/shared/api/get-account.api';
import { accountQueryKey } from '@/shared/hooks/use-get-account.hook';
import { getErrorMessage } from '@/shared/lib/get-error-message';
import { updateQueryCache } from '@/shared/lib/update-query-cache';
import { configureSendWindow } from '../api/configure-send-window.api';
import {
    configureSendWindowSchema,
    type ConfigureSendWindowFormData,
} from '../schemas/configure-send-window.schema';

type SendWindow =
    paths['/account']['get']['responses'][200]['content']['application/json']['account']['sendWindow'];

/*
 * Configura a janela diária de envio (API-07). O formulário começa com a
 * janela atual da account e, após salvar, a resposta da API substitui
 * `account.sendWindow` no cache e vira o novo valor inicial do formulário.
 */
export const useConfigureSendWindow = (sendWindow: SendWindow | undefined) => {
    const {
        register,
        control,
        reset: resetForm,
        handleSubmit: formHandleSubmit,
        formState: { errors },
    } = useForm<ConfigureSendWindowFormData>({
        resolver: zodResolver(configureSendWindowSchema),
        defaultValues: {
            start: sendWindow?.start ?? '',
            end: sendWindow?.end ?? '',
            timeZone: sendWindow?.timeZone ?? '',
        },
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
            resetForm({
                start: response.start,
                end: response.end,
                timeZone: response.timeZone,
            });
            toast.success('Janela de envio salva.');
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });

    const handleSubmit = formHandleSubmit((data) => {
        mutation.mutate(data);
    });

    return {
        register,
        control,
        errors,
        isPending: mutation.isPending,
        handleSubmit,
    };
};
