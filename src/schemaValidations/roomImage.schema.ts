import { z } from 'zod'
export const AddImageToRoomBody = z.object({
  roomId: z.number(),
  image: z.array(z.string())
})
export type AddImageToRoomBodyType = z.TypeOf<typeof AddImageToRoomBody>

export const getImagesByRoomIdResponse = z.object({
  code: z.number(),
  data: z.array(
    z.object({
      id: z.number(),
      imageUrl: z.string()
    })
  ),
  message: z.string()
})

export type getImagesByRoomIdResponseType = z.TypeOf<typeof getImagesByRoomIdResponse>
