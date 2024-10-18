import { z } from 'zod'
import { AmenitySchema } from './amenity.schema'

export const GetListAmenityOrderRes = z.object({
  code: z.number(),
  currentPage: z.number(),
  totalPage: z.number(),
  recordPerPage: z.number(),
  totalRecord: z.number(),
  data: z.array(AmenitySchema)
})
export type GetListAmenityOrderResType = z.TypeOf<typeof GetListAmenityOrderRes>
