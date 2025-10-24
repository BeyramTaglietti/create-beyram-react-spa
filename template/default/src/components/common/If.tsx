import type { UseQueryResult } from "@tanstack/react-query";
import { type ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Spinner } from "../ui";
import { ErrorRetry } from "./ErrorRetry";

type IfProps<T, E = Error> = {
  query: UseQueryResult<T, E>;
  errorComponent?: ReactElement;
  emptyComponent?: ReactElement;
  isEmpty?: boolean;
  loadingComponent?: ReactElement;
  children: (data: T) => ReactElement;
};
export const If = <T, E = Error>({
  query,
  errorComponent = <ErrorRetry onRetry={() => query.refetch()} />,
  emptyComponent = <DefaultEmptyComponent />,
  isEmpty,
  loadingComponent = <Spinner className="size-10" />,
  children,
}: IfProps<T, E>) => {
  if (query.isLoading) {
    return loadingComponent;
  }

  if (query.isError) {
    return errorComponent;
  }

  if (!query.data || isEmpty) {
    return emptyComponent;
  }

  return children(query.data);
};

export const DefaultEmptyComponent = () => {
  const { t } = useTranslation();
  return (
    <span className="w-full py-8 flex justify-center items-center">
      {t("app.no_data")}
    </span>
  );
};
