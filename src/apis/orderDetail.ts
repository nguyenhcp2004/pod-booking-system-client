import queryString from 'query-string'
import { GetListOrderDetailQueryType, GetListOrderDetailResType } from '~/schemaValidations/orderDetail.schema'
import http from '~/utils/http'

export const orderDetailApiRequest = {
  getOrderDetail: (query: GetListOrderDetailQueryType) => {
    const pagination = {
      page: query.page,
      take: query.take,
      status: query.status
    }
    const stringified = queryString.stringify(pagination)
    return http.get<GetListOrderDetailResType>(`/order-detail/${query.customerId}?${stringified}`)
  }
}
