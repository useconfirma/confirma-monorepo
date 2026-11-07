import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { signIn } from '../api/sign-in.api';
import { signInSchema, type SignInFormData } from '../schemas/sign-in.schema';

export const useSignIn = () => {
    const {
        register,
        handleSubmit: formHandleSubmit,
        formState: { errors },
    } = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
    });
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: signIn,
        onSuccess: () => {
            void navigate({ to: '/overview', replace: true });
        },
        // onError: () => {},
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
