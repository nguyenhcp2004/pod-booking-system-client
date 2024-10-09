import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import buildingApiRequest from '~/apis/building'

export const useGetListBuilding = () => {
  return useQuery({
    queryKey: ['buidlings'],
    queryFn: buildingApiRequest.getListBuidling
  })
}

export const useCreateBuildingMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: buildingApiRequest.createBuilding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buidlings'] })
    }
  })
}

export const useEditBuildingMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: buildingApiRequest.editBuilding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buidlings'] })
    }
  })
}
