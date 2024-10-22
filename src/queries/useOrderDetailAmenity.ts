import { useMutation, useQueryClient } from '@tanstack/react-query'
import orderDetailAmenityApi from '~/apis/orderDetailAmenity'

export const useCreateOrderDetailAmenityMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: orderDetailAmenityApi.createOrderDetailAmenity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-detail-amenity'] })
    }
  })
}
