import { useQuery } from '@tanstack/react-query'
import amenityOrderApiRequest from '~/apis/amenityOrderApi'
import { Pagination } from '~/constants/type'

export const useGetListAmenityOrders = (query: Pagination) => {
  return useQuery({
    queryKey: ['get-order-amenity'],
    queryFn: () => amenityOrderApiRequest.getListAmenityOrders(query)
  })
}
