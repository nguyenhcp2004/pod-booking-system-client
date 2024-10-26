import { z } from 'zod'

export const GetListOrderDetailQuery = z
  .object({
    customerId: z.string(),
    page: z.number().optional(),
    take: z.number().optional(),
    status: z.string().optional()
  })
  .strict()

export type GetListOrderDetailQueryType = z.TypeOf<typeof GetListOrderDetailQuery>

const AmenitySchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  quantity: z.number()
})

export const OrderDetailSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  buildingId: z.number(),
  roomId: z.number(),
  roomName: z.string(),
  roomImage: z.string(),
  orderId: z.string(),
  amenities: z.array(AmenitySchema),
  servicePackageId: z.number(),
  orderHandledId: z.string().nullable(),
  priceRoom: z.number(),
  status: z.enum(['Pending', 'Successfully', 'Rejected']),
  startTime: z.string(),
  endTime: z.string(),
  createdAt: z.string()
})

export type OrderDetailType = z.TypeOf<typeof OrderDetailSchema>

export const GetListOrderDetailRes = z.object({
  code: z.number(),
  data: z.array(OrderDetailSchema),
  currentPage: z.number(),
  totalPage: z.number(),
  recordPerPage: z.number(),
  totalRecord: z.number()
})

export type GetListOrderDetailResType = z.TypeOf<typeof GetListOrderDetailRes>

export const OrderDetailFullInfoRes = z.object({
  code: z.number(),
  message: z.string(),
  data: z.object({
    id: z.string().uuid(),
    roomId: z.number(),
    roomName: z.string(),
    roomImage: z.string(),
    roomPrice: z.number(),
    status: z.string(),
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
    buildingAddress: z.string(),
    buildingId: z.number(),
    servicePackage: z.object({
      id: z.number(),
      name: z.string(),
      discountPercentage: z.number()
    }),
    customer: z.object({
      id: z.string().uuid(),
      name: z.string(),
      email: z.string().email(),
      avatar: z.string().url(),
      role: z.string(),
      buildingNumber: z.number(),
      rankingName: z.string().nullable()
    }),
    orderHandler: z.nullable(z.string()),
    amenities: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        price: z.number(),
        quantity: z.number()
      })
    )
  })
})

export type OrderDetailFullInfoResType = z.TypeOf<typeof OrderDetailFullInfoRes>

export const GetRevenueRes = z.object({
  code: z.number(),
  data: z.number(),
  message: z.string()
})

export type GetRevenueResType = z.TypeOf<typeof GetRevenueRes>

export const GetRevenueReq = z.object({
  startTime: z.string().nullable(),
  endTime: z.string().nullable()
})

export type GetRevenueReqType = z.TypeOf<typeof GetRevenueReq>

export const RevenueByMonthSchema = z.object({
  date: z.string(),
  revenue: z.number()
})

export const GetRevenueByMonthRes = z.object({
  code: z.number(),
  data: z.array(RevenueByMonthSchema),
  message: z.string()
})

export type GetRevenueByMonthResType = z.TypeOf<typeof GetRevenueByMonthRes>
