import { useMutation } from '@tanstack/react-query';
import { logout } from '@/shared/api/logout.api';

export const useLogout = () => {
    return useMutation({ mutationFn: logout });
};
