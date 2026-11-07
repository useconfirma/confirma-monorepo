import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { requestInvitation } from '../api/request-invitation.api';
import {
    requestInvitationSchema,
    type RequestInvitationFormData,
} from '../schemas/request-invitation.schema';

export const useRequestInvitation = () => {
    const { register, handleSubmit: formHandleSubmit } =
        useForm<RequestInvitationFormData>({
            resolver: zodResolver(requestInvitationSchema),
        });

    const mutation = useMutation({
        mutationFn: requestInvitation,
        // onSuccess: () => {},
        // onError: () => {},
    });

    const handleSubmit = formHandleSubmit((data) => {
        mutation.mutate(data);
    });

    return { register, isPending: mutation.isPending, handleSubmit };
};
