import { z } from 'zod'

export const LoginBody = z
  .object({
    email: z.string().email({ message: 'Email không hợp lệ.' }),
    password: z
      .string()
      .min(6, { message: 'Password từ 6 kí tự trở lên.' })
      .max(30, { message: 'Password không hợp lệ.' })
  })
  .strict()

export type LoginBodyType = z.TypeOf<typeof LoginBody>

export const Account = z.object({
  name: z.string(),
  email: z.string(),
  avatar: z.string()
})

export type AccountType = z.TypeOf<typeof Account>

export const LoginRes = z.object({
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    account: Account
  }),
  message: z.string(),
  code: z.number()
})

export type LoginResType = z.TypeOf<typeof LoginRes>

export const RefreshTokenBody = z
  .object({
    refreshToken: z.string()
  })
  .strict()

export type RefreshTokenBodyType = z.TypeOf<typeof RefreshTokenBody>

export const RefreshTokenRes = z.object({
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string()
  }),
  message: z.string(),
  code: z.number()
})

export type RefreshTokenResType = z.TypeOf<typeof RefreshTokenRes>

export const LogoutBody = z
  .object({
    refreshToken: z.string()
  })
  .strict()

export type LogoutBodyType = z.TypeOf<typeof LogoutBody>

export interface ErrorResponse<Data> {
  code: number
  message: string
  data?: Data
}

export interface SucccessResponse<Data> {
  code: number
  message: string
  data: Data
}

//cú pháp `-? sẽ loại bỏ undefined key optional
export type NoUndefinedField<T> = {
  [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>
}

export type AuthResponse = SucccessResponse<{
  accessToken: string
  refreshToken: string
  account: AccountType
}>

export interface ErrorResponse<Data> {
  code: number
  message: string
  data?: Data
}
