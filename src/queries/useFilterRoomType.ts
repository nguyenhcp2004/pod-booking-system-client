import { useQuery } from '@tanstack/react-query'
import { roomTypeApiRequest } from '~/apis/roomType'
import { FilterRoomTypeQuery } from '~/schemaValidations/roomType.schema'

export const useGetFilterRoomType = (query: FilterRoomTypeQuery) => {
  return useQuery({
    queryKey: ['roomTypes'],
    queryFn: () => roomTypeApiRequest.getListRoomTypeFiltered(query)
  })
}
