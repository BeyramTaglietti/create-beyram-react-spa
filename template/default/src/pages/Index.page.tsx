import { Button } from "@/components/ui";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export const IndexPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="w-dwh h-dvh flex items-center justify-center flex-col gap-2">
        <h1>{t("app.home")}</h1>
        <Button onClick={() => toast.success("This is a success toast")}>
          Show a toast
        </Button>
      </div>
    </>
  );
};
