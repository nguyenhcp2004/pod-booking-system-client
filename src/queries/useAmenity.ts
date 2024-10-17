import { useQuery } from '@tanstack/react-query'
import amenityApiRequest from '~/apis/amenity'
import { AmenityType } from '~/schemaValidations/amenity.schema'

export const useGetAmenities = () => {
  return useQuery<AmenityType[]>({
    queryKey: ['amenities'],
    queryFn: async () => {
      const response = await amenityApiRequest.getAllAmenities()
      return response.data.data
    }
  })
}

export const useGetAmenitiesByType = (amenityType: string) => {
  return useQuery({
    queryKey: ['amenitiesByType'],
    queryFn: () => amenityApiRequest.getAmenitiesByType(amenityType)
  })
}
