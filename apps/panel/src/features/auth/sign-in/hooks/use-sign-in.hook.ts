import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { signIn } from '../api/sign-in.api';
import { signInSchema, type SignInFormData } from '../schemas/sign-in.schema';

export const useSignIn = () => {
    const { register, handleSubmit: formHandleSubmit } =
        useForm<SignInFormData>({
            resolver: zodResolver(signInSchema),
        });

    const mutation = useMutation({
        mutationFn: signIn,
        // onSuccess: () => {},
        // onError: () => {},
    });

    const handleSubmit = formHandleSubmit((data) => {
        mutation.mutate(data);
    });

    return { register, isPending: mutation.isPending, handleSubmit };
};
