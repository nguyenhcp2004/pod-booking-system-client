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

export const CreateAssignmentBody = z
  .object({
    staffId: z.string().min(1, 'Tên nhân viên là bắt buộc'),
    slot: z.string().min(1, 'Khung giờ là bắt buộc'),
    weekDate: z.string().min(1, 'Ngày là bắt buộc')
  })
  .strict()

export type CreateAssignmentBodyType = z.TypeOf<typeof CreateAssignmentBody>
