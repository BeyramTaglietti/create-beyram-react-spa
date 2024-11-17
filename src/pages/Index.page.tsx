import { Button } from "@/components/ui";
import { useTranslation } from "react-i18next";

export const IndexPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <h1 className="text-red-500">{t("app.home")}</h1>
      <Button>Click me</Button>
    </>
  );
};
