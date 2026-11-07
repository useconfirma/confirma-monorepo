import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { requestInvitation } from '../api/request-invitation.api';
import {
    requestInvitationSchema,
    type RequestInvitationFormData,
} from '../schemas/request-invitation.schema';

export const useRequestInvitation = () => {
    const {
        register,
        handleSubmit: formHandleSubmit,
        reset: resetForm,
        formState: { errors },
    } = useForm<RequestInvitationFormData>({
        resolver: zodResolver(requestInvitationSchema),
    });

    const mutation = useMutation({
        mutationFn: requestInvitation,
        // onError: () => {},
    });

    const handleSubmit = formHandleSubmit((data) => {
        mutation.mutate(data);
    });

    // Volta ao formulário vazio para pedir convite para outro e-mail.
    const reset = () => {
        mutation.reset();
        resetForm();
    };

    return {
        register,
        errors,
        isPending: mutation.isPending,
        isSuccess: mutation.isSuccess,
        sentTo: mutation.variables?.email,
        handleSubmit,
        reset,
    };
};
