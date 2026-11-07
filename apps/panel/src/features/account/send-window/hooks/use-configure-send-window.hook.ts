import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
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

    const mutation = useMutation({
        mutationFn: configureSendWindow,
        // onSuccess: () => {},
        // onError: () => {},
    });

    const handleSubmit = formHandleSubmit((data) => {
        mutation.mutate(data);
    });

    return { register, isPending: mutation.isPending, handleSubmit };
};
