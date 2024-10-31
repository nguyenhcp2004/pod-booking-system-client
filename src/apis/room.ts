import {
  AvailableSlotsQueryType,
  AvailableSlotsResType,
  BookedRoomSchemaResType,
  CountServedRoomsResType,
  CreateRoomBodyType,
  CreateRoomResType,
  EditRoomBodyType,
  EditRoomResType,
  FilterRoomByTypeAndDateQueryType,
  FilterRoomByTypeAndDateResType,
  FilterRoomByTypeAndSlotsQueryType,
  FilterRoomByTypeAndSlotsResType,
  GetBookedRoomsReqType,
  GetListRoomsResType,
  SlotsByRoomsAndDateQueryType,
  SlotsByRoomsAndDateResType,
  UnavailableRoomsQueryType,
  UnavailableRoomsResType
} from '~/schemaValidations/room.schema'
import http from '~/utils/http'
import queryString from 'query-string'
import { Pagination } from '~/constants/type'

export const roomApiRequest = {
  getRoomsByTypeAndSlots: (query: FilterRoomByTypeAndSlotsQueryType) => {
    const stringified = queryString.stringify(query)
    return http.get<FilterRoomByTypeAndSlotsResType>(`/rooms/available-rooms?${stringified}`)
  },
  getAvailableSlots: (query: AvailableSlotsQueryType) => {
    const stringified = queryString.stringify(query)
    return http.get<AvailableSlotsResType>(`/rooms/available-slots?${stringified}`)
  },
  getUnavailableRooms: (query: UnavailableRoomsQueryType) => {
    if (query.startTime && query.endTime) {
      const stringified = queryString.stringify(query)
      return http.get<UnavailableRoomsResType>(`/rooms/unavailable?${stringified}`)
    }
  },
  getListRooms: (query: Pagination) => {
    const stringified = queryString.stringify(query)
    return http.get<GetListRoomsResType>(`/rooms?${stringified}`)
  },
  createRoom: (body: CreateRoomBodyType) => http.post<CreateRoomResType>('/rooms', body),
  editRoom: (body: EditRoomBodyType) => http.put<EditRoomResType>(`/rooms/${body.id}`, body),
  getBookedRooms: () => http.get<BookedRoomSchemaResType>(`/rooms/booked-rooms`),
  countServedRooms: () => http.get<CountServedRoomsResType>('/rooms/number-served-rooms-currently'),
  getBookedRoomsById: (query: GetBookedRoomsReqType) => {
    const stringified = queryString.stringify(query)
    if (query) {
      return http.get<BookedRoomSchemaResType>(`/rooms/booked-rooms/account?${stringified}`)
    }
  },
  getRoomsByTypeAndDate: (query: FilterRoomByTypeAndDateQueryType) => {
    const stringified = queryString.stringify(query)
    return http.get<FilterRoomByTypeAndDateResType>(`/rooms/available-by-type-and-date?${stringified}`)
  },
  getSlotsByRoomsAndDate: (query: SlotsByRoomsAndDateQueryType) => {
    const stringified = queryString.stringify(query)
    return http.get<SlotsByRoomsAndDateResType>(`/rooms/slots-by-rooms-and-date?${stringified}`)
  }
}

export default roomApiRequest
