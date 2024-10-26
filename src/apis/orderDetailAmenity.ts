import http from '~/utils/http'
import {
  CreateOrderDetailAmenityResType,
  OrderDetailAmenityBodyType,
  OrderDetailAmenityStaffBodyType
} from '~/schemaValidations/orderDetailAmenity.schema'

const orderDetailAmenityApi = {
  createOrderDetailAmenity: (body: OrderDetailAmenityBodyType) =>
    http.post<CreateOrderDetailAmenityResType>('/order-detail-amenity', body),
  createOrderDetailAmenityStaff: (body: OrderDetailAmenityStaffBodyType) =>
    http.post<string>('/order-detail-amenity/create', body)
}

export default orderDetailAmenityApi
