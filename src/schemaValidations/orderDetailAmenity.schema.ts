import { z } from 'zod'

const OrderDetailAmenityBody = z.object({
  quanity: z.number(),
  price: z.number(),
  orderDetailId: z.string(),
  amenityId: z.number()
})

const AmenitySchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.string(),
  imageUrl: z.string().nullable()
})

const OrderDetailAmenitySchema = z.object({
  id: z.string(),
  quantity: z.number(),
  price: z.number(),
  orderDetailId: z.string(),
  amenity: AmenitySchema
})

const OrderDetailAmenityRes = z.object({
  code: z.number(),
  data: OrderDetailAmenitySchema,
  message: z.string()
})

export type OrderDetailAmenityBodyType = z.TypeOf<typeof OrderDetailAmenityBody>

export type CreateOrderDetailAmenityResType = z.TypeOf<typeof OrderDetailAmenityRes>
