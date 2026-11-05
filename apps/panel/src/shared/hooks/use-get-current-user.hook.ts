import { queryOptions, useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '@/shared/api/get-current-user.api';

export const currentUserQueryKey = ['current-user'] as const;

export const currentUserQueryOptions = queryOptions({
    queryKey: currentUserQueryKey,
    queryFn: getCurrentUser,
});

export const useGetCurrentUser = () => {
    return useQuery(currentUserQueryOptions);
};
