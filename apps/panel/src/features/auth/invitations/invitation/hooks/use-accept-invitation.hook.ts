import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { acceptInvitation } from '../api/accept-invitation.api';
import {
    acceptInvitationSchema,
    type AcceptInvitationFormData,
} from '../schemas/accept-invitation.schema';

export const useAcceptInvitation = (invitationToken: string) => {
    const {
        register,
        handleSubmit: formHandleSubmit,
        formState: { errors },
    } = useForm<AcceptInvitationFormData>({
        resolver: zodResolver(acceptInvitationSchema),
    });

    const mutation = useMutation({
        mutationFn: acceptInvitation,
        // onSuccess: () => {},
        // onError: () => {},
    });

    const handleSubmit = formHandleSubmit(({ accountName, password }) => {
        mutation.mutate({ accountName, password, invitationToken });
    });

    return {
        register,
        errors,
        isPending: mutation.isPending,
        handleSubmit,
    };
};
