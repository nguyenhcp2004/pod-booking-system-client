import http from '~/utils/http'
import {
  GetListAmenityResType,
  EditAmenityBodyType,
  CreateAmenityResType,
  CreateAmenityBodyType,
  AmenityListResType
} from '~/schemaValidations/amenity.schema'
import { Pagination } from '~/constants/type'
import queryString from 'query-string'

const amenityApiRequest = {
  getAllAmenities: () => {
    return http.get<AmenityListResType>('/amenity/all')
  },
  getListAmenity: (query: Pagination) => {
    const stringified = queryString.stringify(query)
    return http.get<GetListAmenityResType>(`/amenity?${stringified}`)
  },
  createAmenity: (body: CreateAmenityBodyType) => http.post<CreateAmenityResType>('/amenity', body),
  editAmenity: (body: EditAmenityBodyType) => http.put<CreateAmenityResType>(`/amenity/${body.id}`, body),
  getAmenitiesByType: (amenityType: string) => {
    return http.get<AmenityListResType>(`/amenity/type?type=${amenityType}`)
  }
}    

export default amenityApiRequest
