import { useQuery } from '@tanstack/react-query'
import { orderDetailApiRequest } from '~/apis/orderDetail'
import { GetListOrderDetailQueryType } from '~/schemaValidations/orderDetail.schema'

export const useGetListOrderDetail = (query: GetListOrderDetailQueryType) => {
  return useQuery({
    queryKey: ['order-detail', { query }],
    queryFn: () => orderDetailApiRequest.getOrderDetailOfCustomer(query)
  })
}
