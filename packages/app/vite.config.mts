import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type UserConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "./",
  test: {
    environment: "jsdom",
    setupFiles: "./test/setup.ts",
    coverage: {
      include: ["src/**"],
    },
  },
} as UserConfig);
