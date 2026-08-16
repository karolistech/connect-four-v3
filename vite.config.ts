import { defineConfig } from "vite";

export default defineConfig({
  base: "/connect-four/",

  build: {
    assetsInlineLimit: 0
  },

  resolve: {
    tsconfigPaths: true
  }
});
