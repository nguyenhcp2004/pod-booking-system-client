import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import buildingApiRequest from '~/apis/building'
import { Pagination } from '~/constants/type'
import { GetFilteredBuildingQueryType } from '~/schemaValidations/building.schema'

export const useGetListBuilding = (query: Pagination) => {
  return useQuery({
    queryKey: ['buidlings', { query }],
    queryFn: () => buildingApiRequest.getListBuidling(query)
  })
}

export const useCreateBuildingMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: buildingApiRequest.createBuilding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filter-building'] })
    }
  })
}

export const useEditBuildingMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: buildingApiRequest.editBuilding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filter-building'] })
    }
  })
}

export const useGetFilterBuilding = (query: GetFilteredBuildingQueryType) => {
  return useQuery({
    queryKey: ['filter-building', { query }],
    queryFn: () => buildingApiRequest.getFilteredBuilding(query)
  })
}

export const useGetAllBuilding = () => {
  return useQuery({
    queryKey: ['all-building'],
    queryFn: () => buildingApiRequest.getAllBuilding()
  })
}
