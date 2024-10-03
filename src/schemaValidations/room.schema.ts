import { z } from 'zod'

const BuildingSchema = z.object({
  id: z.number(),
  address: z.string(),
  description: z.string(),
  hotlineNumber: z.string(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string()
})

const RoomTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
  quantity: z.number(),
  capacity: z.number(),
  building: BuildingSchema
})

const RoomSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  description: z.string(),
  image: z.string(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  roomType: RoomTypeSchema
})

const FilterRoomQuery = z.object({
  address: z.string().optional(),
  capacity: z.number().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  page: z.number().optional(),
  take: z.number().optional()
})

export type FilterRoomQueryType = z.TypeOf<typeof FilterRoomQuery>

const FilterRoomRes = z.object({
  code: z.number(),
  data: z.array(RoomSchema),
  currentPage: z.number(),
  totalPage: z.number(),
  recorderPerPage: z.number(),
  totalRecord: z.number()
})

export type FilterRoomResType = z.TypeOf<typeof FilterRoomRes>

const FilterRoomByTypeAndSlotsQuery = z.object({
  typeId: z.number(),
  slots: z.array(z.string())
})

export type FilterRoomByTypeAndSlotsQueryType = z.TypeOf<typeof FilterRoomByTypeAndSlotsQuery>

export const FilterRoomByTypeAndSlotsRes = z.object({
  code: z.number(),
  data: z.array(RoomSchema),
  message: z.string()
})
export type FilterRoomByTypeAndSlotsResType = z.TypeOf<typeof FilterRoomByTypeAndSlotsRes>
