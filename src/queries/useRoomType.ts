import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import roomTypeApiRequest, { createRoomTypeApi, deleteRoomTypeApi, updateRoomTypeApi } from '~/apis/roomType'
import { RoomTypeRequest } from '~/schemaValidations/roomType.schema'

export const useCreateRoomType = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (createData: RoomTypeRequest) => createRoomTypeApi(createData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roomTypes'] })
    },
    onError: (error) => {
      console.error('Error creating room type:', error)
    }
  })
}

export const useUpdateRoomType = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ updateData, roomTypeId }: { updateData: RoomTypeRequest; roomTypeId: number }) =>
      updateRoomTypeApi(updateData, roomTypeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roomTypes'] })
    },
    onError: (error) => {
      console.error('Error updating room type:', error)
    }
  })
}

export const useDeleteRoomType = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (roomTypeId: number) => deleteRoomTypeApi(roomTypeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roomTypes'] })
    },
    onError: (error) => {
      console.error('Error deleting room type:', error)
    }
  })
}

export const useGetRoomTypeByAddress = (address: string) => {
  return useQuery({
    queryKey: ['room-type-by-address'],
    queryFn: () => roomTypeApiRequest.getRoomTypeByAddress(address)
  })
}

export const useGetRoomTypeByBuildingId = (buildingId: number) => {
  return useQuery({
    queryKey: ['room-type-by-building-id'],
    queryFn: () => roomTypeApiRequest.getRoomTypeByBuildingId(buildingId)
  })
}
