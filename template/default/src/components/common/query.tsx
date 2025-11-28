import type { UseQueryResult } from "@tanstack/react-query";
import { type ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Spinner } from "../ui";
import { ErrorRetry } from "./error-retry";

type QueryProps<T, E = Error> = {
  query: UseQueryResult<T, E>;
  errorComponent?: ReactElement | null;
  emptyComponent?: ReactElement | null;
  isEmpty?: boolean;
  loadingComponent?: ReactElement | null;
  children: (data: T) => ReactElement;
};
export const Query = <T, E = Error>(props: QueryProps<T, E>) => {
  const ErrorComponent = props.errorComponent ?? (
    <ErrorRetry onRetry={() => props.query.refetch()} />
  );
  const EmptyComponent = props.emptyComponent ?? <DefaultEmptyComponent />;
  const loadingComponent = props.loadingComponent ?? (
    <DefaultLoadingComponent />
  );

  if (props.query.isLoading) {
    return loadingComponent;
  }

  if (props.query.isError) {
    return ErrorComponent;
  }

  if (!props.query.data || props.isEmpty) {
    return EmptyComponent;
  }

  return props.children(props.query.data);
};

const DefaultEmptyComponent = () => {
  const { t } = useTranslation();
  return (
    <span className="w-full py-8 flex justify-center items-center">
      {t("app.no_data")}
    </span>
  );
};

const DefaultLoadingComponent = () => {
  return (
    <div className="w-full py-8 flex justify-center items-center">
      <Spinner className="size-10" />
    </div>
  );
};
