import { reactRouter } from "@react-router/dev/vite"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig, loadEnv } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')


  return {
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
    server: {
      host: "0.0.0.0",
      port: env.PORT ? Number(env.PORT) : undefined,
      proxy: {
        "/api": {
          target: env.API_URL || "http://localhost:3001",
          changeOrigin: true,
          secure: false
        }
      },
      allowedHosts: ['staging.nathdomain.com',"nathdomain.com"],
    }
  }
})