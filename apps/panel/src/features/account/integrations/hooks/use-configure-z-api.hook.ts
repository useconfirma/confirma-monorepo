import { useMutation } from '@tanstack/react-query';
import { configureZApi } from '../api/configure-z-api.api';

export const useConfigureZApi = () => {
    return useMutation({ mutationFn: configureZApi });
};
