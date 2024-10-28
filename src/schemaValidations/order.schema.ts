import { z } from 'zod'

export const CountOrderRes = z.object({
  code: z.number(),
  data: z.number(),
  message: z.string()
})
export type CountOrderResType = z.TypeOf<typeof CountOrderRes>

export const CountOrderReq = z.object({
  startTime: z.string().nullable(),
  endTime: z.string().nullable()
})

export type CountOrderReqType = z.TypeOf<typeof CountOrderReq>

export const GetListOrderByAccountIdQuery = z.object({
  accountId: z.string(),
  page: z.number().optional(),
  take: z.number().optional(),
  status: z.string().optional()
})
export type GetListOrderByAccountIdQueryType = z.TypeOf<typeof GetListOrderByAccountIdQuery>

const servicePackageSchema = z.object({
  id: z.number(),
  name: z.string(),
  discountPercentage: z.number()
})

const customerSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatar: z.string().url().nullable(),
  role: z.string(),
  buildingNumber: z.number(),
  rankingName: z.string()
})

const orderHandlerSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatar: z.string().url().nullable(),
  role: z.string(),
  buildingNumber: z.number(),
  rankingName: z.string().nullable()
})

const orderDetailSchema = z.object({
  id: z.string(),
  roomId: z.number(),
  roomName: z.string(),
  roomPrice: z.number(),
  status: z.string(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  buildingAddress: z.string(),
  buildingId: z.number(),
  servicePackage: servicePackageSchema,
  customer: customerSchema,
  orderHandler: orderHandlerSchema,
  amenities: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      price: z.number(),
      quantity: z.number()
    })
  )
})

export const OrderdSchema = z.object({
  id: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  orderDetails: z.array(orderDetailSchema)
})

export const GetListOrderByAccountIdRes = z.object({
  code: z.number(),
  message: z.string(),
  data: z.array(OrderdSchema),
  currentPage: z.number(),
  totalPage: z.number(),
  recordPerPage: z.number(),
  totalRecord: z.number()
})

export type GetListOrderByAccountIdResType = z.TypeOf<typeof GetListOrderByAccountIdRes>
