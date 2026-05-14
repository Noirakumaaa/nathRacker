import { z } from "zod"

const envSchema = z.object({
  VITE_API_URL: z.string().url("VITE_API_URL must be a valid URL").optional(),
})

const parsed = envSchema.safeParse(import.meta.env)

if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `  ${i.path.join(".")}: ${i.message}`).join("\n")
  throw new Error(`Invalid environment variables:\n${issues}`)
}

export const env = parsed.data
