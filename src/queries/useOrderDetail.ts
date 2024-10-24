import { useQuery } from '@tanstack/react-query'
import { orderDetailApiRequest } from '~/apis/orderDetail'
import { GetListOrderDetailQueryType, GetRevenueReqType } from '~/schemaValidations/orderDetail.schema'

export const useGetListOrderDetail = (query: GetListOrderDetailQueryType) => {
  return useQuery({
    queryKey: ['order-detail', { query }],
    queryFn: () => orderDetailApiRequest.getOrderDetail(query)
  })
}

export const useGetRevenue = (query: GetRevenueReqType) => {
  return useQuery({
    queryKey: ['order-detail-revenue'],
    queryFn: () => orderDetailApiRequest.getRevenue(query)
  })
}
