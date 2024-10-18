import {
  AvailableSlotsQueryType,
  AvailableSlotsResType,
  BookedRoomSchemaResType,
  CreateRoomBodyType,
  CreateRoomResType,
  EditRoomBodyType,
  EditRoomResType,
  FilterRoomByTypeAndSlotsQueryType,
  FilterRoomByTypeAndSlotsResType,
  GetListRoomsResType,
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
    const stringified = queryString.stringify(query)
    return http.get<UnavailableRoomsResType>(`/rooms/unavailable?${stringified}`)
  },
  getListRooms: (query: Pagination) => {
    const stringified = queryString.stringify(query)
    return http.get<GetListRoomsResType>(`/rooms?${stringified}`)
  },
  createRoom: (body: CreateRoomBodyType) => http.post<CreateRoomResType>('/rooms', body),
  editRoom: (body: EditRoomBodyType) => http.put<EditRoomResType>(`/rooms/${body.id}`, body),
  getBookedRooms: () => http.get<BookedRoomSchemaResType>(`/rooms/booked-rooms`)
}

export default roomApiRequest
