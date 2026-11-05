import { useMutation } from '@tanstack/react-query';
import { signIn } from '../api/sign-in.api';

export const useSignIn = () => {
    return useMutation({ mutationFn: signIn });
};
