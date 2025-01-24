/// <reference types="vite/client" />

type ImportMetaEnvAugmented =
  import("@julr/vite-plugin-validate-env").ImportMetaEnvAugmented<
    typeof import("../env").default
  >;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ImportMetaEnv extends ImportMetaEnvAugmented {
  // Now import.meta.env is totally type-safe and based on your `env.ts` schema definition
  // You can also add custom variables that are not defined in your schema
}
