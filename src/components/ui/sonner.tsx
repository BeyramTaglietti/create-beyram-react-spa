import { cn } from "@/utils";
import { cva } from "class-variance-authority";
import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const toastVariants = cva(
  "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
  {
    variants: {
      variant: {
        default:
          "group-[.toaster]:bg-primary group-[.toaster]:text-primary-foreground",
        destructive:
          "group-[.toaster]:bg-destructive group-[.toaster]:text-destructive-foreground",
        success: "group-[.toaster]:bg-green-500 group-[.toaster]:text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          toast: cn(toastVariants({ variant: "default" })),
          error: cn(toastVariants({ variant: "destructive" })),
          success: cn(toastVariants({ variant: "success" })),
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
