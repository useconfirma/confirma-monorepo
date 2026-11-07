import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { logout } from '@/shared/api/logout.api';

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
    });
};
