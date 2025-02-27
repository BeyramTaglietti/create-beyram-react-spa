import { cn } from "@/utils";
import { cva } from "class-variance-authority";
import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const toastVariants = cva("", {
  variants: {
    variant: {
      default: "!bg-background !text-foreground !border-background",
      error: "!bg-destructive !text-white !border-destructive",
      success: "!bg-green-500 !text-white !border-green-500",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          default: cn(toastVariants({ variant: "default" })),
          error: cn(toastVariants({ variant: "error" })),
          success: cn(toastVariants({ variant: "success" })),
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
