import { SucccessResponse } from './util'

export type AuthResponse = SucccessResponse<{
  access_token: string
  refresh_token: string
}>
