import { useQuery } from '@tanstack/react-query'
import roomFilterApiRequest from '~/apis/room'
import {
  AvailableSlotsQueryType,
  FilterRoomByTypeAndDateQueryType,
  FilterRoomByTypeAndSlotsQueryType,
  SlotsByRoomsAndDateQueryType,
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
    queryFn: () => roomFilterApiRequest.getUnavailableRooms(query),
    enabled: Boolean(query && query.startTime && query.endTime)
  })
}

export const useGetRoomsByTypeAndDate = (query: FilterRoomByTypeAndDateQueryType) => {
  return useQuery({
    queryKey: ['rooms-by-type-and-date'],
    queryFn: () => roomFilterApiRequest.getRoomsByTypeAndDate(query)
  })
}

export const useGetSlotsByRoomsAndDate = (query: SlotsByRoomsAndDateQueryType) => {
  return useQuery({
    queryKey: ['slots-by-rooms-and-date'],
    queryFn: () => roomFilterApiRequest.getSlotsByRoomsAndDate(query)
  })
}
