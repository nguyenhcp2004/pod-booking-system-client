import { FilterRoomQueryType, FilterRoomResType } from '~/schemaValidations/room.schema'
import http from '~/utils/http'
import queryString from 'query-string'

const roomFilterApiRequest = {
  getListRoomFiltered: (query: FilterRoomQueryType) => {
    const stringified = queryString.stringify(query)
    return http.get<FilterRoomResType>(`/rooms/filtered-room?${stringified}`)
  }
}

export default roomFilterApiRequest
