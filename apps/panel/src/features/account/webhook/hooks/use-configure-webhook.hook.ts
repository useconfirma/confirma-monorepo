import { useMutation } from '@tanstack/react-query';
import { configureWebhook } from '../api/configure-webhook.api';

export const useConfigureWebhook = () => {
    return useMutation({ mutationFn: configureWebhook });
};
