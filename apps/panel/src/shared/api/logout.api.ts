import { apiClient } from '@/shared/lib/api-client';

export const logout = async () => {
    await apiClient.delete('/sessions/current');
};
