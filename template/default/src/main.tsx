import { Toaster } from "@/components/ui";
import { queryClient } from "@/config";
import "@/i18n";
import "@/index.css";
import { routeTree } from "@/routeTree.gen";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { setDefaultOptions } from "date-fns";
import { it } from "date-fns/locale";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

setDefaultOptions({ locale: it });

// Create a new router instance
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster />
    </QueryClientProvider>
  </StrictMode>
);
