import queryString from 'query-string'
import {
  GetListOrderDetailQueryType,
  GetListOrderDetailResType,
  OrderDetailFullInfoResType,
  GetRevenueReqType,
  GetRevenueResType,
  GetNumberOrderByBuildingResType,
  GetRevenueChartBodyType,
  GetRevenueChartResType
} from '~/schemaValidations/orderDetail.schema'
import http from '~/utils/http'
import { formatQueryDateTime } from '~/utils/utils'

export const orderDetailApiRequest = {
  getOrderDetailOfCustomer: (query: GetListOrderDetailQueryType) => {
    const pagination = {
      page: query.page,
      take: query.take,
      status: query.status
    }
    const stringified = queryString.stringify(pagination)
    return http.get<GetListOrderDetailResType>(`/order-detail/customer/${query.customerId}?${stringified}`)
  },
  getOrderDetail: (orderDetailId: string) => http.get<OrderDetailFullInfoResType>(`/order-detail/${orderDetailId}`),
  getRevenueCurrentDay: () => {
    return http.get<GetRevenueResType>(`/order-detail/revenue-current-day`)
  },
  getRevenue: (query: GetRevenueReqType) => {
    let queryString = ''
    if (query.startTime && query.endTime) {
      queryString = formatQueryDateTime(query.startTime as string, query.endTime as string)
    }
    return http.get<GetRevenueResType>(`/order-detail/revenue?${queryString}`)
  },
  getRevenueChart: (query: GetRevenueChartBodyType) => {
    const stringified = queryString.stringify(query)
    return http.get<GetRevenueChartResType>(`/order-detail/revenue-chart?${stringified}`)
  },
  getNumberOrdersByBuilding: () => {
    return http.get<GetNumberOrderByBuildingResType>('/order-detail/number-order-by-building')
  }
}
