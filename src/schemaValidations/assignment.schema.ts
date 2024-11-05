import { z } from 'zod'

export const GetAssignmentsRes = z.object({
  code: z.number(),
  data: z.array(
    z.object({
      id: z.string().uuid(),
      staffId: z.string().uuid(),
      slot: z.string(),
      weekDate: z.string(),
      nameStaff: z.string()
    })
  )
})

export type GetAssignmentsResType = z.TypeOf<typeof GetAssignmentsRes>
