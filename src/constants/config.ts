import { z } from 'zod'

const configSchema = z.object({
  VITE_API_ENDPOINT: z.string(),
  VITE_URL: z.string(),
  VITE_GOOGLE_CLIENT_ID: z.string(),
  VITE_GOOGLE_AUTHORIZED_REDIRECT_URI: z.string(),
  VITE_SOCKET_URL: z.string(),
  VITE_API_KEY: z.string(),
  VITE_AUTH_DOMAIN: z.string(),
  VITE_PROJECT_ID: z.string(),
  VITE_STORAGE_BUCKET: z.string(),
  VITE_MESSAGING_SENDER_ID: z.string(),
  VITE_APP_ID: z.string(),
  VITE_MEASUREMENT_ID: z.string()
})

const configProject = configSchema.safeParse({
  VITE_API_ENDPOINT: import.meta.env.VITE_API_ENDPOINT,
  VITE_URL: import.meta.env.VITE_URL,
  VITE_GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  VITE_GOOGLE_AUTHORIZED_REDIRECT_URI: import.meta.env.VITE_GOOGLE_AUTHORIZED_REDIRECT_URI,
  VITE_SOCKET_URL: import.meta.env.VITE_SOCKET_URL,
  VITE_API_KEY: import.meta.env.VITE_API_KEY,
  VITE_AUTH_DOMAIN: import.meta.env.VITE_AUTH_DOMAIN,
  VITE_PROJECT_ID: import.meta.env.VITE_PROJECT_ID,
  VITE_STORAGE_BUCKET: import.meta.env.VITE_STORAGE_BUCKET,
  VITE_MESSAGING_SENDER_ID: import.meta.env.VITE_MESSAGING_SENDER_ID,
  VITE_APP_ID: import.meta.env.VITE_APP_ID,
  VITE_MEASUREMENT_ID: import.meta.env.VITE_MEASUREMENT_ID
})

if (!configProject.success) {
  console.error(configProject.error.errors)
  throw new Error(`Các khai báo biến môi trường không hợp lệ`)
}

const envConfig = configProject.data

export default envConfig
