import { z } from 'zod'
export const AddImageToRoomBody = z.object({
  roomId: z.number(),
  image: z.array(z.string())
})
export type AddImageToRoomBodyType = z.TypeOf<typeof AddImageToRoomBody>
