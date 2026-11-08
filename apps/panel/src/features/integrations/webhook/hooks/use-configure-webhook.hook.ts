import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { paths } from '@/shared/@types/api';
import type { GetAccountResponse } from '@/shared/api/get-account.api';
import { accountQueryKey } from '@/shared/hooks/use-get-account.hook';
import { updateQueryCache } from '@/shared/lib/update-query-cache';
import { configureWebhook } from '../api/configure-webhook.api';
import {
    configureWebhookSchema,
    type ConfigureWebhookFormData,
} from '../schemas/configure-webhook.schema';
import { generateWebhookSecret } from '../utils/generate-webhook-secret.util';

type Webhook =
    paths['/account']['get']['responses'][200]['content']['application/json']['account']['webhook'];

/*
 * Configura o webhook de saída (API-09). O contrato exige o segredo em todo
 * salvamento, então cada envio gera um segredo novo no painel. Com webhook já
 * configurado, o envio validado espera a confirmação (`isConfirming`), porque
 * o segredo atual deixa de valer. O cache da account recebe só a resposta da
 * API; o segredo fica apenas nas variáveis desta mutation, exposto como
 * `generatedSecret`, e é descartado por `reset`.
 */
export const useConfigureWebhook = (webhook: Webhook | undefined) => {
    const {
        register,
        reset: resetForm,
        handleSubmit: formHandleSubmit,
        formState: { errors },
    } = useForm<ConfigureWebhookFormData>({
        resolver: zodResolver(configureWebhookSchema),
        defaultValues: { url: webhook?.url ?? '' },
    });
    const queryClient = useQueryClient();
    const [pendingUrl, setPendingUrl] = useState<string | null>(null);

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
            resetForm({ url: response.url });
        },
    });

    const save = (url: string) => {
        mutation.mutate({ url, secret: generateWebhookSecret() });
    };

    const handleSubmit = formHandleSubmit(({ url }) => {
        if (webhook?.configured) {
            setPendingUrl(url);
            return;
        }

        save(url);
    });

    const confirm = () => {
        if (pendingUrl) save(pendingUrl);
        setPendingUrl(null);
    };

    const changeConfirmation = (open: boolean) => {
        if (!open) setPendingUrl(null);
    };

    // Descarta o segredo gerado depois que o diálogo é fechado.
    const reset = () => {
        mutation.reset();
    };

    return {
        register,
        errors,
        isPending: mutation.isPending,
        isError: mutation.isError,
        handleSubmit,
        isConfirming: pendingUrl !== null,
        confirm,
        changeConfirmation,
        generatedSecret: mutation.isSuccess ? mutation.variables.secret : null,
        reset,
    };
};
