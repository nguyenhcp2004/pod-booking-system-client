import { useQuery } from '@tanstack/react-query'
import buildingApiRequest from '~/apis/building'

export const useGetListBuilding = () => {
  return useQuery({
    queryKey: ['buidlings'],
    queryFn: buildingApiRequest.getListBuidling
  })
}
