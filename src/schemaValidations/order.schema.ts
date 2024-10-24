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
