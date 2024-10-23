import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import orderDetailAmenityApi from '~/apis/orderDetailAmenity'
import amenityOrderApiRequest from '~/apis/amenityOrderApi'
import { Pagination } from '~/constants/type'

export const useCreateOrderDetailAmenityMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: orderDetailAmenityApi.createOrderDetailAmenity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-detail-amenity'] })
    }
  })
}

export const useGetListAmenityOrders = (query: Pagination) => {
  return useQuery({
    queryKey: ['get-order-amenity'],
    queryFn: () => amenityOrderApiRequest.getListAmenityOrders(query)
  })
}
