// import the original type declarations
import "i18next";
// import all namespaces (for the default language, only)
import it from "./languages/it.json";

declare module "i18next" {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    defaultNS: "it";
    resources: {
      it: typeof it;
    };
    // other
  }
}
