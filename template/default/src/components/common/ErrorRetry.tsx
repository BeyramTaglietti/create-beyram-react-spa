import { RefreshCcwIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui";

type ErrorRetryProps = {
  message?: string;
  onRetry?: () => void;
};
export const ErrorRetry = ({ message, onRetry }: ErrorRetryProps) => {
  const { t } = useTranslation();

  const errorMessage = message ?? t("app.loading_error");

  return (
    <>
      <div className="flex flex-col gap-3 w-full items-center justify-center p-5">
        <p className="text-destructive">{errorMessage}</p>
        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            {t("app.retry")}
            <RefreshCcwIcon className="size-4" />
          </Button>
        )}
      </div>
    </>
  );
};
