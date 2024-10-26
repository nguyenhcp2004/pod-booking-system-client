import queryString from 'query-string'
import {
  GetListOrderDetailQueryType,
  GetListOrderDetailResType,
  GetRevenueReqType,
  GetRevenueResType
} from '~/schemaValidations/orderDetail.schema'
import http from '~/utils/http'
import { formatQueryDateTime } from '~/utils/utils'

export const orderDetailApiRequest = {
  getOrderDetail: (query: GetListOrderDetailQueryType) => {
    const pagination = {
      page: query.page,
      take: query.take,
      status: query.status
    }
    const stringified = queryString.stringify(pagination)
    return http.get<GetListOrderDetailResType>(`/order-detail/${query.customerId}?${stringified}`)
  },
  getRevenue: (query: GetRevenueReqType) => {
    const queryString = formatQueryDateTime(query.startTime as string, query.endTime as string)
    return http.get<GetRevenueResType>(`/order-detail/revenue?${queryString}`)
  }
}
