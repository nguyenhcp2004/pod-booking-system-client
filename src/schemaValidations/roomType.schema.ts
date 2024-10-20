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
  price: z.number(),
  quantity: z.number(),
  capacity: z.number(),
  building: BuildingSchema
})

export type RoomTypeSchemaType = z.TypeOf<typeof RoomTypeSchema>

const FilterRoomTypeQuery = z.object({
  address: z.string().optional(),
  capacity: z.number().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  page: z.number().optional(),
  take: z.number().optional()
})

export type FilterRoomTypeQuery = z.TypeOf<typeof FilterRoomTypeQuery>

const FilterRoomTypeRes = z.object({
  code: z.number(),
  data: z.array(RoomTypeSchema),
  currentPage: z.number(),
  totalPage: z.number(),
  recorderPerPage: z.number(),
  totalRecord: z.number()
})

export type FilterRoomTypeRes = z.TypeOf<typeof FilterRoomTypeRes>

export const RoomTypeRequest = z.object({
  name: z.string(),
  price: z.number().min(1000),
  quantity: z.number(),
  capacity: z.number().min(1),
  buildingId: z.number()
})

export type RoomTypeRequest = z.TypeOf<typeof RoomTypeRequest>
