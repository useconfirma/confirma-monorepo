import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { logout } from '@/shared/api/logout.api';
import { getErrorMessage } from '@/shared/lib/get-error-message';

export const useLogout = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: logout,
        // Sai das rotas protegidas antes de limpar o cache, para que nenhuma
        // query montada refaça a busca sem sessão.
        onSuccess: async () => {
            await navigate({ to: '/sign-in', replace: true });
            queryClient.clear();
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });
};
