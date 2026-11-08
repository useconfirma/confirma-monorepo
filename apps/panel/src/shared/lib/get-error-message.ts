import { isAxiosError } from 'axios';

type ApiError = { error: { code: string; message: string } };

// Mensagem para a pessoa usuária a partir do erro de uma query ou mutation.
export const getErrorMessage = (error: unknown) =>
    (isAxiosError<ApiError>(error) && error.response?.data?.error?.message) ||
    'Não foi possível concluir a operação. Tente novamente.';
