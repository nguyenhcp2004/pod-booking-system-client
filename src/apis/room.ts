import {
  AvailableSlotsQueryType,
  AvailableSlotsResType,
  FilterRoomByTypeAndSlotsQueryType,
  FilterRoomByTypeAndSlotsResType,
  UnavailableRoomsQueryType,
  UnavailableRoomsResType
} from '~/schemaValidations/room.schema'
import http from '~/utils/http'
import queryString from 'query-string'

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
  }
}

export default roomApiRequest
