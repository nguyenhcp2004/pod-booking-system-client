import { useQuery } from '@tanstack/react-query'
import { orderDetailApiRequest } from '~/apis/orderDetail'
import {
  GetListOrderDetailQueryType,
  GetRevenueChartBodyType,
  GetRevenueReqType
} from '~/schemaValidations/orderDetail.schema'

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

export const useGetRevenue = (query: GetRevenueReqType) => {
  return useQuery({
    queryKey: ['order-detail-revenue', query],
    queryFn: () => orderDetailApiRequest.getRevenue(query),
    enabled: !!query.startTime && !!query.endTime
  })
}

export const useGetRevenueCurrentDay = () => {
  return useQuery({
    queryKey: ['order-detail-revenue-current-day'],
    queryFn: () => orderDetailApiRequest.getRevenueCurrentDay()
  })
}

export const useGetRevenueByMonth = (query: GetRevenueChartBodyType) => {
  return useQuery({
    queryKey: ['order-detail-revenue-by-month', query],
    queryFn: () => orderDetailApiRequest.getRevenueChart(query)
  })
}

export const useGetNumberOrderByBuilding = () => {
  return useQuery({
    queryKey: ['order-detail-number-order-by-month'],
    queryFn: () => orderDetailApiRequest.getNumberOrdersByBuilding()
  })
}
