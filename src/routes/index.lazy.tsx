import { createLazyFileRoute } from "@tanstack/react-router";
import { IndexPage } from "../pages";

export const Route = createLazyFileRoute("/")({
  component: IndexPage,
});
