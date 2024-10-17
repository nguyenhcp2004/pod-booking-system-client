import http from '~/utils/http'
import { AmenityListResType } from '~/schemaValidations/amenity.schema'

const amenityApiRequest = {
  getAllAmenities: () => {
    return http.get<AmenityListResType>('/amenity')
  },
  getAmenitiesByType: (amenityType: string) => {
    return http.get<AmenityListResType>(`/amenity/type?type=${amenityType}`)
  }
}

export default amenityApiRequest
