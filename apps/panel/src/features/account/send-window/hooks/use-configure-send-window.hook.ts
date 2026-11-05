import { useMutation } from '@tanstack/react-query';
import { configureSendWindow } from '../api/configure-send-window.api';

export const useConfigureSendWindow = () => {
    return useMutation({ mutationFn: configureSendWindow });
};
