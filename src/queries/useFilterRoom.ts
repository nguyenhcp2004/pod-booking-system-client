import { useQuery } from '@tanstack/react-query'
import roomFilterApiRequest from '~/apis/room'
import { FilterRoomByTypeAndSlotsQueryType, FilterRoomQueryType } from '~/schemaValidations/room.schema'

export const useGetFilterRoom = (query: FilterRoomQueryType) => {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: () => roomFilterApiRequest.getListRoomFiltered(query)
  })
}

export const useGetRoomsByTypeAndSlots = (query: FilterRoomByTypeAndSlotsQueryType) => {
  return useQuery({
    queryKey: ['rooms-by-type-and-slots'],
    queryFn: () => roomFilterApiRequest.getRoomsByTypeAndSlots(query)
  })
}
