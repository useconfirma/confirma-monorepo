import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
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

    const mutation = useMutation({
        mutationFn: configureZApi,
        // onSuccess: () => {},
        // onError: () => {},
    });

    const handleSubmit = formHandleSubmit((data) => {
        mutation.mutate(data);
    });

    return { register, isPending: mutation.isPending, handleSubmit };
};
