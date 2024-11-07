import { z } from 'zod'

const OrderDetailAmenityReq = z.object({
  startDate: z.string(),
  endDate: z.string(),
  page: z.number(),
  take: z.number(),
  searchParams: z.string() || ''
})
export type OrderDetailAmenityReqType = z.TypeOf<typeof OrderDetailAmenityReq>

const AmenityOrderSchema = z.object({
  id: z.string(),
  quantity: z.number(),
  price: z.number(),
  orderDetailId: z.string(),
  amenityId: z.number(),
  amenityName: z.string(),
  amenityType: z.string(),
  status: z.enum(['Booked', 'Paid', 'Delivered', 'Canceled']),
  statusDescription: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string().nullable()
})
export type AmenityOrderType = z.TypeOf<typeof AmenityOrderSchema>

export const OrderDetailAmenitySchema = z.object({
  id: z.string(),
  customerId: z.string(),
  customerName: z.string(),
  buildingId: z.number(),
  buildingAddress: z.string(),
  roomId: z.number(),
  roomName: z.string(),
  orderId: z.string(),
  orderDetailAmenities: z.array(AmenityOrderSchema),
  servicePackageId: z.number(),
  orderHandledId: z.string().nullable(),
  priceRoom: z.number(),
  status: z.enum(['Pending', 'Successfully', 'Rejected']),
  startTime: z.string(),
  endTime: z.string(),
  createdAt: z.string()
})
export type OrderDetailAmenityType = z.TypeOf<typeof OrderDetailAmenitySchema>

export const GetListAmenityOrderRes = z.object({
  code: z.number(),
  data: z.array(OrderDetailAmenitySchema),
  currentPage: z.number(),
  totalPage: z.number(),
  recordPerPage: z.number(),
  totalRecord: z.number()
})
export type GetListAmenityOrderResType = z.TypeOf<typeof GetListAmenityOrderRes>

const EditAmenityOrderBodySchema = z.object({
  id: z.string(),
  status: z.enum(['Booked', 'Paid', 'Delivered', 'Canceled'])
})

export type EditAmenityOrderBodyType = z.TypeOf<typeof EditAmenityOrderBodySchema>
