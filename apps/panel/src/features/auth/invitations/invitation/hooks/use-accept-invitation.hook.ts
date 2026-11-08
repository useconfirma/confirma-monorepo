import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/get-error-message';
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

    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: acceptInvitation,
        // A API já grava o cookie de sessão; a conta entra direto no painel.
        onSuccess: () => {
            void navigate({ to: '/welcome', replace: true });
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
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
