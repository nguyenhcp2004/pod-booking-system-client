import {
  FilterRoomTypeQuery,
  FilterRoomTypeRes,
  GetRoomTypeByAddressResType,
  RoomTypeRequest
} from '~/schemaValidations/roomType.schema'
import http from '~/utils/http'
import queryString from 'query-string'

export const roomTypeApiRequest = {
  getListRoomTypeFiltered: (query: FilterRoomTypeQuery) => {
    const stringified = queryString.stringify(query)
    return http.get<FilterRoomTypeRes>(`/room-types/filtered-room-type?${stringified}`)
  },
  getRoomTypeByAddress: (address: string) => {
    console.log(`address: ${address}`)
    return http.get<GetRoomTypeByAddressResType>(`/room-types/room-type-within-address?address=${address}`)
  }
}

export default roomTypeApiRequest

export const updateRoomTypeApi = async (updateData: RoomTypeRequest, roomTypeId: number) => {
  try {
    const parsedRequest = RoomTypeRequest.parse(updateData)
    const response = await http.put(`/room-types/${roomTypeId}`, parsedRequest)
    return response.data
  } catch (error) {
    console.error('Error update room type:', error)
    throw error
  }
}

export const createRoomTypeApi = async (createData: RoomTypeRequest) => {
  try {
    const parsedRequest = RoomTypeRequest.parse(createData)
    const response = await http.post(`/room-types`, parsedRequest)
    return response.data
  } catch (error) {
    console.error('Error create room type:', error)
    throw error
  }
}

export const deleteRoomTypeApi = async (roomTypeId: number) => {
  try {
    const response = await http.delete(`/room-types/${roomTypeId}`)
    return response.data
  } catch (error) {
    console.error('Error delete room type:', error)
    throw error
  }
}
