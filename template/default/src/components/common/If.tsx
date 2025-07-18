import type { UseQueryResult } from "@tanstack/react-query";
import { memo, type ReactElement } from "react";

type IfProps<T> = {
  query: UseQueryResult<T>;
  error: ReactElement;
  empty?: ReactElement;
  isEmpty?: boolean;
  loading: ReactElement;
  children: (data: T) => ReactElement;
};
export const If = memo(
  <T,>({ query, error, empty, isEmpty, loading, children }: IfProps<T>) => {
    if (query.isLoading) {
      return loading;
    }

    if (query.isError) {
      return error;
    }

    if (!query.data || isEmpty) {
      return empty;
    }

    return children(query.data);
  }
);
