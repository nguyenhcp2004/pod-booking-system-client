import { z } from 'zod'
import { Account } from '~/schemaValidations/auth.schema'

export const GetMeBody = z
  .object({
    id: z.string()
  })
  .strict()

export type GetMeBodyType = z.TypeOf<typeof GetMeBody>

export const GetMeRes = z.object({
  data: Account,
  message: z.string(),
  code: z.number()
})

export type GetMeResType = z.TypeOf<typeof GetMeRes>

const AccountSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  avatar: z.string(),
  point: z.number(),
  role: z.string(),
  balance: z.number(),
  buildingNumber: z.number(),
  rankingName: z.string(),
  createdAt: z.string(),
  status: z.number()
})

const ManageAccountRes = z.object({
  code: z.number(),
  data: z.array(AccountSchema),
  currentPage: z.number(),
  totalPage: z.number(),
  recorderPerPage: z.number(),
  totalRecord: z.number()
})

export type GetManageAccountRes = z.TypeOf<typeof ManageAccountRes>

export const UpdateAccountByAdminBody = z.object({
  id: z.string(),
  name: z.string().optional(),
  buildingNumber: z.number(),
  role: z.string().optional(),
  status: z.number().optional()
})

export type UpdateAccountByAdminBodyType = z.TypeOf<typeof UpdateAccountByAdminBody>

export const UpdateAccountByAdminRes = z.object({
  code: z.number(),
  message: z.string(),
  data: AccountSchema
})

export type UpdateAccountByAdminResType = z.TypeOf<typeof UpdateAccountByAdminRes>
