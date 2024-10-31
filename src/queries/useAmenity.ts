import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import amenityApiRequest from '~/apis/amenity'
import { PaginationSearchQuery } from '~/constants/type'
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

export const useGetActiveAmenities = () => {
  return useQuery<AmenityType[]>({
    queryKey: ['amenities'],
    queryFn: async () => {
      const response = await amenityApiRequest.getAllActiveAmenities()
      return response.data.data
    }
  })
}

export const useGetListAmenity = (query: PaginationSearchQuery) => {
  return useQuery({
    queryKey: ['amenity', { query }],
    queryFn: () => amenityApiRequest.getListAmenity(query)
  })
}

export const useCreateAmenityMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: amenityApiRequest.createAmenity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amenity'] })
    }
  })
}

export const useEditAmenityMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: amenityApiRequest.editAmenity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amenity'] })
    }
  })
}

export const useGetAmenitiesByType = (amenityType: string) => {
  return useQuery({
    queryKey: ['amenitiesByType'],
    queryFn: () => amenityApiRequest.getAmenitiesByType(amenityType)
  })
}

export const useDeleteAmenityMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => amenityApiRequest.deleteAmenity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amenity'] })
    }
  })
}

export const useGetAvailableAmenity = (buildingId: number) => {
  return useQuery({
    queryKey: ['available-amenity', { buildingId }],
    queryFn: () => amenityApiRequest.getAvailableAmenityByBuilding(buildingId)
  })
}
