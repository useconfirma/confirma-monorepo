import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
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

    const mutation = useMutation({
        mutationFn: configureWebhook,
        // onSuccess: () => {},
        // onError: () => {},
    });

    const handleSubmit = formHandleSubmit((data) => {
        mutation.mutate(data);
    });

    return { register, isPending: mutation.isPending, handleSubmit };
};
