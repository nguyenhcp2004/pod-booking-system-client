import { z } from 'zod'

const AmenitySchema = z.object({
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

export const GetListAmenityRes = z.object({
  code: z.number(),
  currentPage: z.number(),
  totalPage: z.number(),
  recordPerPage: z.number(),
  totalRecord: z.number(),
  data: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      price: z.number(),
      quantity: z.number(),
      type: z.string(),
      imageUrl: z.string()
    })
  )
})

export type GetListAmenityResType = z.TypeOf<typeof GetListAmenityRes>

export const CreateAmenityBody = z
  .object({
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
    type: z.string(),
    imageUrl: z.string()
  })
  .strict()

export type CreateAmenityBodyType = z.TypeOf<typeof CreateAmenityBody>

export const CreateAmenityRes = z.object({
  code: z.number(),
  message: z.string(),
  data: z.object({
    id: z.number(),
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
    type: z.string(),
    imageUrl: z.string()
  })
})

export type CreateAmenityResType = z.TypeOf<typeof CreateAmenityRes>

export enum AmenityTypeEnum {
  Food = 'Food',
  Office = 'Office'
}

export const EditAmenityBody = z
  .object({
    id: z.number(),
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
    type: z.string(),
    imageUrl: z.string()
  })
  .strict()

export type EditAmenityBodyType = z.TypeOf<typeof EditAmenityBody>

export const EditAmenityRes = z.object({
  code: z.number(),
  message: z.string(),
  data: z.object({
    id: z.number(),
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
    type: z.string(),
    imageUrl: z.string()
  })
})

export type EditAmenityResType = z.TypeOf<typeof EditAmenityRes>
