import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import it from "./languages/it.json";

enum SupportedLanguages {
  it = "it",
}

const resources: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key in SupportedLanguages]: { translation: any };
} = {
  it: {
    translation: it,
  },
};

i18n.use(initReactI18next).init({
  fallbackLng: "it",
  interpolation: {
    escapeValue: false,
  },
  resources,
});

export { i18n, resources, SupportedLanguages };
