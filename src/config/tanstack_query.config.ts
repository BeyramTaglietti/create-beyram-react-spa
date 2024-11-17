import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const queryCache = new QueryCache({
  onError: (error) => {
    toast.error(error.message);
  },
});

const mutationCache = new MutationCache({
  onError: (error) => {
    toast.error(error.message);
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
  queryCache,
  mutationCache,
});

// type InifiniteQueryDefaults = {
//   getNextPageParam: (p: PaginatedQuery<unknown>) => number | undefined;
//   pageSize: number;
//   initialPageParam: number;
// };
// const InfiniteQueryDefaults: InifiniteQueryDefaults = {
//   getNextPageParam: (lastPage) => {
//     if (lastPage.page < lastPage.maxPages) {
//       return lastPage.page + 1;
//     }

//     return undefined;
//   },
//   pageSize: 25,
//   initialPageParam: 1,
// };

export { queryClient };
