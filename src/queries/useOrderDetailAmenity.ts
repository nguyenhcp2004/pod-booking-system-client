import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import orderDetailAmenityApi from '~/apis/orderDetailAmenity'
import amenityOrderApiRequest from '~/apis/amenityOrderApi'
import { OrderDetailAmenityReqType } from '~/schemaValidations/amenityOrder.schema'

export const useCreateOrderDetailAmenityMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: orderDetailAmenityApi.createOrderDetailAmenity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-detail-amenity'] })
    }
  })
}

export const useGetListAmenityOrders = (query: OrderDetailAmenityReqType) => {
  return useQuery({
    queryKey: ['get-order-amenity'],
    queryFn: () => amenityOrderApiRequest.getListAmenityOrders(query)
  })
}

export const useUpdateAmenityOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: amenityOrderApiRequest.updateAmenityOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['update-order-amenity'] })
    }
  })
}

export const useCreateOrderDetailAmenityStaff = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: orderDetailAmenityApi.createOrderDetailAmenityStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['create-order-detail-amenity-staff'] })
    }
  })
}

export const useSearchAmenityInOrderDetailAmenity = (query: OrderDetailAmenityReqType) => {
  return useQuery({
    queryKey: ['search-amenity-in-order-detail-amenity', query],
    queryFn: () => amenityOrderApiRequest.searchAmenityInOrderDetailAmenity(query)
  })
}
