import { z } from 'zod'

export const LoginBody = z
  .object({
    email: z.string().email({ message: 'Email không hợp lệ.' }),
    password: z
      .string()
      .min(6, { message: 'Password từ 6 - 30 kí tự.' })
      .max(30, { message: 'Password từ 6 - 30 kí tự.' })
  })
  .strict()

export type LoginBodyType = z.TypeOf<typeof LoginBody>

export const RegisterBody = z
  .object({
    name: z
      .string()
      .min(5, { message: 'Tên người dùng phải có ít nhất 5 kí tự.' })
      .max(30, { message: 'Tên người dùng phải là 5 - 30 kí tự.' }),
    email: z.string().email({ message: 'Email không hợp lệ.' }),
    password: z
      .string()
      .min(6, { message: 'Mật khẩu từ 6 - 30 kí tự.' })
      .max(30, { message: 'Mật khẩu từ 6 - 30 kí tự.' }),
    confirmPassword: z
      .string()
      .min(6, 'Xác nhận mật khẩu từ 6 - 30 kí tự.')
      .max(30, 'Xác nhận mật khẩu từ 6 - 30 kí tự.')
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu không khớp',
        path: ['confirmPassword']
      })
    }
  })

export type RegisterBodyType = z.TypeOf<typeof RegisterBody>

export const Account = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  avatar: z.string(),
  phoneNumber: z.string(),
  balance: z.number(),
  rankingName: z.string(),
  point: z.number(),
  role: z.string(),
  buildingNumber: z.number()
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

export const LogoutRes = z.object({
  message: z.string(),
  code: z.number()
})

export type LogoutResType = z.TypeOf<typeof LogoutRes>

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
