import { IndexPage } from "@/pages";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: IndexPage,
});
