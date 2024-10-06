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

export const AvailableSlotsQuery = z.object({
  roomIds: z.array(z.number()),
  slots: z.array(z.string())
})

export type AvailableSlotsQueryType = z.TypeOf<typeof AvailableSlotsQuery>

const SlotCustomSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
  available: z.boolean()
})

export const RoomCustomSchema = z.object({
  roomId: z.number(),
  roomName: z.string(),
  slots: z.array(SlotCustomSchema)
})

const RoomCustomArraySchema = z.array(RoomCustomSchema)

export type RoomCustomArraySchemaType = z.TypeOf<typeof RoomCustomArraySchema>

export type RoomCustomSchemaType = z.TypeOf<typeof RoomCustomSchema>

export const AvailableSlotsRes = z.object({
  code: z.number(),
  data: z.array(RoomCustomSchema),
  message: z.string()
})

export type AvailableSlotsResType = z.TypeOf<typeof AvailableSlotsRes>

export const UnavailableRoomsQuery = z.object({
  startTime: z.string(),
  endTime: z.string()
})

export type UnavailableRoomsQueryType = z.TypeOf<typeof UnavailableRoomsQuery>

export const UnavailableRoomSchema = z.object({
  roomId: z.number(),
  name: z.string(),
  startTime: z.string(),
  endTime: z.string()
})

export const UnavailableRoomsRes = z.object({
  code: z.number(),
  data: z.array(UnavailableRoomSchema),
  message: z.string()
})

export type UnavailableRoomsResType = z.TypeOf<typeof UnavailableRoomsRes>
