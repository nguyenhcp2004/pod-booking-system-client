import {
  FilterRoomByTypeAndSlotsQueryType,
  FilterRoomByTypeAndSlotsResType,
  FilterRoomQueryType,
  FilterRoomResType
} from '~/schemaValidations/room.schema'
import http from '~/utils/http'
import queryString from 'query-string'

export const roomApiRequest = {
  getListRoomFiltered: (query: FilterRoomQueryType) => {
    const stringified = queryString.stringify(query)
    return http.get<FilterRoomResType>(`/rooms/filtered-room?${stringified}`)
  },
  getRoomsByTypeAndSlots: (query: FilterRoomByTypeAndSlotsQueryType) => {
    const stringified = queryString.stringify(query)
    return http.get<FilterRoomByTypeAndSlotsResType>(`/rooms/available-rooms?${stringified}`)
  }
}

export default roomApiRequest
