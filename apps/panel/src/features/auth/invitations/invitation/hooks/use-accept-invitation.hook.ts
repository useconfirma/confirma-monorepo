import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { acceptInvitation } from '../api/accept-invitation.api';
import {
    acceptInvitationSchema,
    type AcceptInvitationFormData,
} from '../schemas/accept-invitation.schema';

export const useAcceptInvitation = () => {
    const { register, handleSubmit: formHandleSubmit } =
        useForm<AcceptInvitationFormData>({
            resolver: zodResolver(acceptInvitationSchema),
        });

    const mutation = useMutation({
        mutationFn: acceptInvitation,
        // onSuccess: () => {},
        // onError: () => {},
    });

    const handleSubmit = formHandleSubmit((data) => {
        mutation.mutate(data);
    });

    return { register, isPending: mutation.isPending, handleSubmit };
};
