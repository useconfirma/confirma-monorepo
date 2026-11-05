import { queryOptions, useQuery } from '@tanstack/react-query';
import { getAccount } from '@/shared/api/get-account.api';

export const accountQueryKey = ['account'] as const;

export const accountQueryOptions = queryOptions({
    queryKey: accountQueryKey,
    queryFn: getAccount,
});

export const useGetAccount = () => {
    return useQuery(accountQueryOptions);
};
