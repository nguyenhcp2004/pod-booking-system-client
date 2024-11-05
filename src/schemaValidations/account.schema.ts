import { z } from 'zod'
import { Account } from '~/schemaValidations/auth.schema'
import { BuildingSchema } from './building.schema'

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

const GetAccountManagementSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  avatar: z.string(),
  point: z.number(),
  role: z.string(),
  balance: z.number(),
  building: BuildingSchema,
  rankingName: z.string(),
  createdAt: z.string(),
  status: z.number()
})

export type AccountSchemaType = z.TypeOf<typeof AccountSchema>

export const ManageAccountRes = z.object({
  code: z.number(),
  data: z.array(GetAccountManagementSchema),
  currentPage: z.number(),
  totalPage: z.number(),
  recorderPerPage: z.number(),
  totalRecord: z.number()
})

export type GetManageAccountRes = z.TypeOf<typeof ManageAccountRes>

export const UpdateAccountByAdminBody = z.object({
  id: z.string(),
  name: z.string().optional(),
  buildingNumber: z.number().optional(),
  role: z.string().optional(),
  status: z.number().optional()
})

export type UpdateAccountByAdminBodyType = z.TypeOf<typeof UpdateAccountByAdminBody>

export const UpdateAccountPhoneNumber = z.object({
  id: z.string(),
  phoneNumber: z
    .string()
    .startsWith('0')
    .min(10, { message: 'Số điện thoại không hợp lệ' })
    .max(11, { message: 'Số điện thoại không hợp lệ' })
})

export type UpdateAccountPhoneNumberType = z.TypeOf<typeof UpdateAccountPhoneNumber>

export const UpdateAccountPhoneNumberRes = z.object({
  code: z.number(),
  message: z.string()
})

export type UpdateAccountPhoneNumberResType = z.TypeOf<typeof UpdateAccountPhoneNumberRes>

export const UpdateAccountByAdminRes = z.object({
  code: z.number(),
  message: z.string(),
  data: AccountSchema
})

export type UpdateAccountByAdminResType = z.TypeOf<typeof UpdateAccountByAdminRes>

export const CreateAccountBody = z.object({
  name: z.string().min(2, { message: 'Tên người dùng ít nhất phải có 2 kí tự' }),
  email: z.string().min(1, { message: 'Email không được bỏ trống' }).email('Chỗ này phải là email hợp lệ'),
  password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 kí tự' }),
  buildingNumber: z.number().gte(0, { message: 'Số tòa nhà không được âm' }).optional(),
  role: z.string(),
  status: z.number()
})

export type CreateAccountBodyType = z.TypeOf<typeof CreateAccountBody>

export const SendMailBody = z.object({
  email: z.string().email(),
  startTime: z.string()
})

export type SendMailBodyType = z.TypeOf<typeof SendMailBody>

export const SendMailRes = z.object({
  code: z.number(),
  message: z.string()
})

export type SendMailResType = z.TypeOf<typeof SendMailRes>

export const CountCustomersRes = z.object({
  code: z.number(),
  data: z.number(),
  message: z.string()
})

export type CountCustomerResType = z.TypeOf<typeof CountCustomersRes>

export const CountCustomerReq = z.object({
  startTime: z.string().nullable(),
  endTime: z.string().nullable()
})

export type CountCustomerReqType = z.TypeOf<typeof CountCustomerReq>
