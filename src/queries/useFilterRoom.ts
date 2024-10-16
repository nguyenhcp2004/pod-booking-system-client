import { useQuery } from '@tanstack/react-query'
import roomFilterApiRequest from '~/apis/room'
import {
  AvailableSlotsQueryType,
  FilterRoomByTypeAndSlotsQueryType,
  UnavailableRoomsQueryType
} from '~/schemaValidations/room.schema'

export const useGetRoomsByTypeAndSlots = (query: FilterRoomByTypeAndSlotsQueryType) => {
  return useQuery({
    queryKey: ['rooms-by-type-and-slots'],
    queryFn: () => roomFilterApiRequest.getRoomsByTypeAndSlots(query)
  })
}

export const useGetAvailableSlots = (query: AvailableSlotsQueryType) => {
  return useQuery({
    queryKey: ['available-slots'],
    queryFn: () => roomFilterApiRequest.getAvailableSlots(query)
  })
}

export const useGetUnavailableRooms = (query: UnavailableRoomsQueryType) => {
  return useQuery({
    queryKey: ['unavailable-rooms'],
    queryFn: () => roomFilterApiRequest.getUnavailableRooms(query)
  })
}
