import { z } from 'zod'

export const AmenitySchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  type: z.string(),
  imageUrl: z.string().nullable(),
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable()
})

export const AmenityListRes = z.object({
  code: z.number(),
  data: z.array(AmenitySchema)
})

export type AmenityType = z.TypeOf<typeof AmenitySchema>
export type AmenityListResType = z.TypeOf<typeof AmenityListRes>
