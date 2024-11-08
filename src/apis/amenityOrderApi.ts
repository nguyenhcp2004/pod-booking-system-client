import queryString from 'query-string'

import {
  EditAmenityOrderBodyType,
  GetListAmenityOrderResType,
  OrderDetailAmenityReqType
} from '~/schemaValidations/amenityOrder.schema'

import http from '~/utils/http'

//For manage
const amenityOrderApiRequest = {
  getListAmenityOrders: (query: OrderDetailAmenityReqType) => {
    const stringified = queryString.stringify(query)
    return http.get<GetListAmenityOrderResType>(`/order-detail-amenity/page?${stringified}`)
  },
  updateAmenityOrder: (body: EditAmenityOrderBodyType) => {
    return http.put(`/order-detail-amenity`, body)
  },

  searchAmenityInOrderDetailAmenity: (query: OrderDetailAmenityReqType) => {
    const stringified = queryString.stringify(query)
    console.log(stringified)
    return http.get<GetListAmenityOrderResType>(`/order-detail-amenity/search?${stringified}`)
  }
}

export default amenityOrderApiRequest
