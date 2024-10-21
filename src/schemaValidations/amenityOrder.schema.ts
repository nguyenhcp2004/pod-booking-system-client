import { z } from 'zod'
import { AmenitySchema } from './amenity.schema'

export const AmenityOrderSchema = z.object({
  id: z.number(),
  orderId: z.string(),
  amenity: AmenitySchema,
  quantity: z.number(),
  price: z.number(),
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable()
})
export type AmenityOrderType = z.TypeOf<typeof AmenityOrderSchema>

export const GetListAmenityOrderRes = z.object({
  code: z.number(),
  currentPage: z.number(),
  totalPage: z.number(),
  recordPerPage: z.number(),
  totalRecord: z.number(),
  data: z.array(AmenityOrderSchema)
})
export type GetListAmenityOrderResType = z.TypeOf<typeof GetListAmenityOrderRes>
