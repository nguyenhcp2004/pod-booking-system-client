import { z } from 'zod'

export const GetListBuidlingBody = z
  .object({
    address: z.string(),
    description: z.string(),
    hotlineNumber: z.string(),
    status: z.string()
  })
  .strict()

export type GetListBuidlingBodyType = z.TypeOf<typeof GetListBuidlingBody>

export const GetListBuidlingRes = z.object({
  code: z.number(),
  currentPage: z.number(),
  totalPage: z.number(),
  recordPerPage: z.number(),
  totalRecord: z.number(),
  data: z.array(
    z.object({
      id: z.number(),
      address: z.string(),
      description: z.string(),
      hotlineNumber: z.string(),
      status: z.string(),
      createdAt: z.string(),
      updatedAt: z.string()
    })
  )
})

export type GetListBuidlingResType = z.TypeOf<typeof GetListBuidlingRes>
