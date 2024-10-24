import queryString from 'query-string'
import { Pagination } from '~/constants/type'
import { GetListAmenityOrderResType } from '~/schemaValidations/amenityOrder.schema'

import http from '~/utils/http'

const amenityOrderApiRequest = {
  getListAmenityOrders: (query: Pagination) => {
    const stringified = queryString.stringify(query)
    return http.get<GetListAmenityOrderResType>(`/amenity-orders?${stringified}`)
  }
}

export default amenityOrderApiRequest
