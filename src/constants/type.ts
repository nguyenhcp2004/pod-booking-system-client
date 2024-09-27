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
