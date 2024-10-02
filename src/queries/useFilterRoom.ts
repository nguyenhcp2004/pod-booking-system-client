import { useQuery } from '@tanstack/react-query'
import roomFilterApiRequest from '~/apis/room'
import { FilterRoomQueryType } from '~/schemaValidations/room.schema'

export const useGetFilterRoom = (query: FilterRoomQueryType) => {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: () => roomFilterApiRequest.getListRoomFiltered(query)
  })
}
