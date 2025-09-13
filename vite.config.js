import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
   root: "src",
   publicDir: path.resolve(__dirname, "public"),
   build: {
      outDir: path.resolve(__dirname, "dist"),
      emptyOutDir: true,
   },
   resolve: {
      alias: {
         "@": path.resolve(__dirname, "src"),
         "@js": path.resolve(__dirname, "src/js"),
         "@fonts": path.resolve(__dirname, "src/assets/fonts"),
         "@scss": path.resolve(__dirname, "src/assets/scss"),
      },
   },
   css: {
      preprocessorOptions: {
         scss: {
            quietDeps: true, // suppresses deprecation warnings from node_modules
            silenceDeprecations: ["mixed-decls", "import", "color-functions", "global-builtin"],
            verbose: false,
         },
      },
   },
   server: {
      port: 5173,
      open: true,
   },
});
