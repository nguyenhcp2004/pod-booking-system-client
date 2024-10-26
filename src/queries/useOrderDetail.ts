import { useQuery } from '@tanstack/react-query'
import { orderDetailApiRequest } from '~/apis/orderDetail'
import { GetListOrderDetailQueryType } from '~/schemaValidations/orderDetail.schema'

export const useGetListOrderDetail = (query: GetListOrderDetailQueryType) => {
  return useQuery({
    queryKey: ['order-details', { query }],
    queryFn: () => orderDetailApiRequest.getOrderDetailOfCustomer(query)
  })
}

export const useGetOrderDetail = (orderDetailId: string) => {
  return useQuery({
    queryKey: ['order-detail', orderDetailId],
    queryFn: () => orderDetailApiRequest.getOrderDetail(orderDetailId)
  })
}
