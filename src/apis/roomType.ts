import { FilterRoomTypeQuery, FilterRoomTypeRes } from '~/schemaValidations/roomType.schema'
import http from '~/utils/http'
import queryString from 'query-string'

export const roomTypeApiRequest = {
  getListRoomTypeFiltered: (query: FilterRoomTypeQuery) => {
    const stringified = queryString.stringify(query)
    return http.get<FilterRoomTypeRes>(`/room-types/filtered-room-type?${stringified}`)
  }
}

export default roomTypeApiRequest
