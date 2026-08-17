import { defineConfig } from "vite";

export default defineConfig({
  base: "/connect-four-v3/",

  build: {
    assetsInlineLimit: 0
  },

  resolve: {
    tsconfigPaths: true
  }
});
