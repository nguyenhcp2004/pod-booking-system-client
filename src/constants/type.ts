import { z } from 'zod'

export type AccountRoleType = (typeof AccountRole)[keyof typeof AccountRole]
export const AccountRole = {
  Admin: 'Admin',
  Customer: 'Customer',
  Manager: 'Manager',
  Staff: 'Staff'
} as const

export interface TokenPayload {
  accountId: string
  exp: number
  iat: number
  scope: AccountRoleType
}

export type ServicePackage = {
  id: string
  name: string
  discountPercentage: number
}

export const ServicePackageRes = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      discountPercentage: z.number()
    })
  ),
  message: z.string(),
  code: z.number()
})

export type ServicePackageResType = z.TypeOf<typeof ServicePackageRes>
