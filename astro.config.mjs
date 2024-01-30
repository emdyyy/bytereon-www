import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  i18n: {
    defaultLocale: "pl",
    locales: [
      "pl",
      {
        path: "de",
        codes: ["de", "de-CH", "de-DE", "de-AU"],
      },
    ],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [tailwind(), react()],
  output: "hybrid",
  adapter: netlify({
    imageCDN: false,
  }),
});
