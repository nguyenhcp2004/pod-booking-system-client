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

const RoomSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  image: z.string(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  roomType: RoomTypeSchema
})

const ServicePackage = z.object({
  id: z.number(),
  name: z.string(),
  discountPercentage: z.number()
})

const BookedRoomSchema = z.object({
  id: z.number(),
  orderId: z.string(),
  orderDetailId: z.string(),
  name: z.string(),
  description: z.string(),
  image: z.string(),
  status: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  servicePackage: ServicePackage,
  roomType: RoomTypeSchema
})

export const BookedRoomSchemaRes = z.object({
  code: z.number(),
  data: z.array(BookedRoomSchema),
  messsage: z.string()
})

export type RoomSchemaType = z.TypeOf<typeof RoomSchema>

export type BookedRoomSchemaType = z.TypeOf<typeof BookedRoomSchema>

export type BookedRoomSchemaResType = z.TypeOf<typeof BookedRoomSchemaRes>

export const FilterRoomByTypeAndSlotsQuery = z.object({
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

export const RoomCustomArraySchema = z.array(RoomCustomSchema)

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

export const GetListRoomsRes = z.object({
  code: z.number(),
  currentPage: z.number(),
  totalPage: z.number(),
  recordPerPage: z.number(),
  totalRecord: z.number(),
  data: z.array(RoomSchema)
})

export type GetListRoomsResType = z.TypeOf<typeof GetListRoomsRes>

export const CreateRoomBody = z.object({
  name: z.string(),
  description: z.string(),
  image: z.string(),
  status: z.string(),
  roomTypeId: z.string()
})

export type CreateRoomBodyType = z.TypeOf<typeof CreateRoomBody>

export const CreateRoomRes = z.object({
  code: z.number(),
  message: z.string(),
  data: RoomSchema
})

export type CreateRoomResType = z.TypeOf<typeof CreateRoomRes>

export const EditRoomBody = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  image: z.string(),
  status: z.string(),
  roomTypeId: z.string()
})

export type EditRoomBodyType = z.TypeOf<typeof EditRoomBody>

export const EditRoomRes = z.object({
  code: z.number(),
  message: z.string(),
  data: RoomSchema
})

export type EditRoomResType = z.TypeOf<typeof EditRoomRes>

export const CountServedRoomsRes = z.object({
  code: z.number(),
  data: z.number(),
  message: z.string()
})

export type CountServedRoomsResType = z.TypeOf<typeof CountServedRoomsRes>

export const GetBookedRoomsReq = z.object({
  accountId: z.string()
})

export type GetBookedRoomsReqType = z.TypeOf<typeof GetBookedRoomsReq>
