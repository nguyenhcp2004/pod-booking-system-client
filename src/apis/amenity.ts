import http from '~/utils/http'
import {
  GetListAmenityResType,
  EditAmenityBodyType,
  CreateAmenityResType,
  CreateAmenityBodyType,
  AmenityListResType,
  DeleteAmenityResType
} from '~/schemaValidations/amenity.schema'
import { PaginationSearchQuery } from '~/constants/type'
import queryString from 'query-string'

const amenityApiRequest = {
  getAllAmenities: () => {
    return http.get<AmenityListResType>('/amenity/all')
  },
  getAllActiveAmenities: () => {
    return http.get<AmenityListResType>('/amenity/allActive')
  },
  getListAmenity: (query: PaginationSearchQuery) => {
    const stringified = queryString.stringify(query)
    return http.get<GetListAmenityResType>(`/amenity?${stringified}`)
  },
  createAmenity: (body: CreateAmenityBodyType) => http.post<CreateAmenityResType>('/amenity', body),
  editAmenity: (body: EditAmenityBodyType) => http.put<CreateAmenityResType>(`/amenity/${body.id}`, body),
  getAmenitiesByType: (amenityType: string) => {
    return http.get<AmenityListResType>(`/amenity/type?type=${amenityType}`)
  },
  deleteAmenity: (id: number) => http.delete<DeleteAmenityResType>(`/amenity/${id}`),
  getAvailableAmenityByBuilding: (buildingId: number) => {
    return http.get<AmenityListResType>(`/amenity/available-amenity?buildingId=${buildingId}`)
  }
}

export default amenityApiRequest
