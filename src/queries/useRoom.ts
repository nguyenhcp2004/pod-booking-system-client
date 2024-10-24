import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import roomApiRequest from '~/apis/room'
import { Pagination } from '~/constants/type'
import { GetBookedRoomsReqType } from '~/schemaValidations/room.schema'

export const useGetListRooms = (query: Pagination) => {
  return useQuery({
    queryKey: ['get-rooms'],
    queryFn: () => roomApiRequest.getListRooms(query)
  })
}
export const useCreateRoomMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: roomApiRequest.createRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['create-rooms'] })
    }
  })
}

export const useEditRoomMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: roomApiRequest.editRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['edit-rooms'] })
    }
  })
}

export const useGetBookedRooms = () => {
  return useQuery({
    queryKey: ['booked-rooms'],
    queryFn: () => roomApiRequest.getBookedRooms()
  })
}

export const useGetBookedRoomsByAccountId = (query: GetBookedRoomsReqType) => {
  return useQuery({
    queryKey: ['booked-rooms'],
    queryFn: () => roomApiRequest.getBookedRoomsById(query)
  })
}
