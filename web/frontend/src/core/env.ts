import { z } from 'zod'

// Seul module qui lit process.env. Tout NEXT_PUBLIC_* est public : aucun secret ici.
const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.union([z.url(), z.literal('/api/backend')]).default('http://localhost:8000'),
})

export const env = envSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
})
