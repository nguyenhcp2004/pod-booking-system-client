import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import roomApiRequest from '~/apis/room'
import { PaginationSearchQuery } from '~/constants/type'
import { GetBookedRoomsReqType } from '~/schemaValidations/room.schema'

export const useGetListRooms = (query: PaginationSearchQuery) => {
  return useQuery({
    queryKey: ['get-rooms', { query }],
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

export const useCountServedRooms = () => {
  return useQuery({
    queryKey: ['count-rooms'],
    queryFn: () => roomApiRequest.countServedRooms()
  })
}

export const useGetBookedRoomsByAccountId = (query: GetBookedRoomsReqType) => {
  return useQuery({
    queryKey: ['booked-rooms-by-account-id'],
    queryFn: () => roomApiRequest.getBookedRoomsById(query)
  })
}
