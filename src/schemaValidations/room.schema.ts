import { z } from 'zod'

export const FilterRoomQuery = z.object({
  address: z.string().optional(),
  capacity: z.number().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  page: z.number().optional(),
  take: z.number().optional()
})

export type FilterRoomQueryType = z.TypeOf<typeof FilterRoomQuery>

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

export const FilterRoomRes = z.object({
  code: z.number(),
  data: z.array(RoomSchema),
  currentPage: z.number(),
  totalPage: z.number(),
  recorderPerPage: z.number(),
  totalRecord: z.number()
})

export type FilterRoomResType = z.TypeOf<typeof FilterRoomRes>
