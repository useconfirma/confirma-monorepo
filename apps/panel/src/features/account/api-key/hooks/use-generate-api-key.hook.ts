import { useMutation } from '@tanstack/react-query';
import { generateApiKey } from '../api/generate-api-key.api';

export const useGenerateApiKey = () => {
    return useMutation({ mutationFn: generateApiKey });
};
