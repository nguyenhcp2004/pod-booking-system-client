import { z } from 'zod'

const configSchema = z.object({
  VITE_API_ENDPOINT: z.string(),
  VITE_URL: z.string(),
  VITE_GOOGLE_CLIENT_ID: z.string(),
  VITE_GOOGLE_AUTHORIZED_REDIRECT_URI: z.string()
})

const configProject = configSchema.safeParse({
  VITE_API_ENDPOINT: import.meta.env.VITE_API_ENDPOINT,
  VITE_URL: import.meta.env.VITE_URL,
  VITE_GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  VITE_GOOGLE_AUTHORIZED_REDIRECT_URI: import.meta.env.VITE_GOOGLE_AUTHORIZED_REDIRECT_URI
})

if (!configProject.success) {
  console.error(configProject.error.errors)
  throw new Error(`Các khai báo biến môi trường không hợp lệ`)
}

const envConfig = configProject.data

export default envConfig
