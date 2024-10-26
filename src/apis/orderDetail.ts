import queryString from 'query-string'
import {
  GetListOrderDetailQueryType,
  GetListOrderDetailResType,
  OrderDetailFullInfoResType
} from '~/schemaValidations/orderDetail.schema'
import http from '~/utils/http'

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
  getOrderDetail: (orderDetailId: string) => http.get<OrderDetailFullInfoResType>(`/order-detail/${orderDetailId}`)
}
