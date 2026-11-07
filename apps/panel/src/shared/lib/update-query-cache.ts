import type { QueryClient, QueryKey } from '@tanstack/react-query';

type QueryDataUpdater<TData> = (
    currentData: TData | undefined,
) => TData | undefined;

export const updateQueryCache = <TData>(
    queryClient: QueryClient,
    queryKey: QueryKey,
    updater: QueryDataUpdater<TData>,
) => {
    queryClient.setQueryData<TData>(queryKey, updater);
};
