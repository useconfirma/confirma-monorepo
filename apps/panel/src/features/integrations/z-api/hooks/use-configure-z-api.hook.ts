import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { paths } from '@/shared/@types/api';
import type { GetAccountResponse } from '@/shared/api/get-account.api';
import { accountQueryKey } from '@/shared/hooks/use-get-account.hook';
import { getErrorMessage } from '@/shared/lib/get-error-message';
import { updateQueryCache } from '@/shared/lib/update-query-cache';
import { configureZApi } from '../api/configure-z-api.api';
import {
    configureZApiSchema,
    type ConfigureZApiFormData,
} from '../schemas/configure-z-api.schema';

type ZApi =
    paths['/account']['get']['responses'][200]['content']['application/json']['account']['zApi'];

/*
 * Configura as credenciais da Z-API (API-10). O formulário começa com o ID da
 * instância atual; os tokens nunca vêm da API e são exigidos em todo
 * salvamento. Após salvar, a resposta substitui `account.zApi` no cache e os
 * tokens digitados são apagados do formulário.
 */
export const useConfigureZApi = (zApi: ZApi | undefined) => {
    const {
        register,
        reset: resetForm,
        handleSubmit: formHandleSubmit,
        formState: { errors },
    } = useForm<ConfigureZApiFormData>({
        resolver: zodResolver(configureZApiSchema),
        defaultValues: {
            instanceId: zApi?.instanceId ?? '',
            instanceToken: '',
            clientToken: '',
        },
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
            resetForm({
                instanceId: response.instanceId,
                instanceToken: '',
                clientToken: '',
            });
            toast.success('Credenciais salvas.');
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
        errors,
        isPending: mutation.isPending,
        handleSubmit,
    };
};
