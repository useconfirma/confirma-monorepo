import { AppError } from '../../domain/errors/app-error.js';
import type {
    RegisterZApiCallbackInput,
    ZApiProvider,
} from '../../../modules/integrations/domain/providers/z-api.provider.js';

export class HttpZApiProvider implements ZApiProvider {
    async registerCallback(input: RegisterZApiCallbackInput): Promise<void> {
        const url = `https://api.z-api.io/instances/${encodeURIComponent(input.instanceId)}/token/${encodeURIComponent(input.instanceToken)}/update-webhook-received`;

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Client-Token': input.clientToken,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ value: input.callbackUrl }),
            });

            if (!response.ok) {
                throw new AppError(
                    'ZAPI_CALLBACK_REGISTRATION_FAILED',
                    'Não foi possível configurar o callback da Z-API.',
                    503,
                );
            }
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            throw new AppError(
                'ZAPI_CALLBACK_REGISTRATION_FAILED',
                'Não foi possível configurar o callback da Z-API.',
                503,
            );
        }
    }
}
