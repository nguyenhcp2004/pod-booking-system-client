import http from '~/utils/http'
import {
  CreateOrderDetailAmenityResType,
  OrderDetailAmenityBodyType
} from '~/schemaValidations/orderDetailAmenity.schema'

const orderDetailAmenityApi = {
  createOrderDetailAmenity: (body: OrderDetailAmenityBodyType) =>
    http.post<CreateOrderDetailAmenityResType>('/order-detail-amenity', body)
}

export default orderDetailAmenityApi
