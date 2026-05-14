import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./app/test/setup.ts"],
    include: ["app/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "html"],
      include: ["app/**/*.{ts,tsx}"],
      exclude: ["app/test/**", "app/routes/**", "app/root.tsx"],
      thresholds: {
        statements: 30,
        functions: 30,
        lines: 30,
        branches: 20,
      },
    },
  },
});
