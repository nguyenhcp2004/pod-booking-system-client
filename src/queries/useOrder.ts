import { useMutation, useQuery } from '@tanstack/react-query'
import {
  deleteOrder,
  getBuilding,
  getPageOrder,
  getRoomSameType,
  getRoomType,
  getStaff,
  OrderUpdateStaffRequest,
  searchAccounts,
  searchBuilding,
  searchOrder,
  updateStaff
} from '~/apis/orderApi'

//Read
export const useOrders = (startDate: string, endDate: string, page: number, size: number) => {
  return useQuery({
    queryKey: ['orders', startDate, endDate, page, size],
    queryFn: () => getPageOrder(startDate, endDate, page, size),
    enabled: !!startDate && !!endDate
  })
}

export const useSearchOrder = (keyword: string, page: number, size: number) => {
  return useQuery({
    queryKey: ['searchOrder', keyword, page, size],
    queryFn: () => searchOrder(keyword, page, size),
    enabled: !!keyword
  })
}

//Create
export const useRoomType = (keyword: string) => {
  return useQuery({
    queryKey: ['roomType', keyword],
    queryFn: () => getRoomType(keyword),
    enabled: !!keyword
  })
}

export const useSearchAccounts = (keyword: string) => {
  return useQuery({
    queryKey: ['searchAccounts', keyword],
    queryFn: () => searchAccounts(keyword),
    enabled: !!keyword
  })
}

export const useBuilding = () => {
  return useQuery({
    queryKey: ['building'],
    queryFn: getBuilding
  })
}

export const useSearchBuilding = (keyword: string) => {
  return useQuery({
    queryKey: ['searchBuilding', keyword],
    queryFn: () => searchBuilding(keyword),
    enabled: !!keyword
  })
}

//Update
export const useStaffAccounts = () => {
  return useQuery({
    queryKey: ['staffAccounts'],
    queryFn: getStaff
  })
}

export const useUpdateStaff = () => {
  return useMutation({
    mutationFn: ({ request }: { request: OrderUpdateStaffRequest }) => updateStaff(request),
    onSuccess: () => {},
    onError: (error) => {
      console.error('Error updating staff:', error)
    }
  })
}

export const useRoomSameType = (roomId: string) => {
  return useQuery({
    queryKey: ['roomByTypeId', roomId],
    queryFn: () => getRoomSameType({ roomId }),
    enabled: !!roomId
  })
}

//Delete
export const useDeleteOrder = () => {
  return useMutation({
    mutationFn: deleteOrder,
    onSuccess: (data) => {
      return data
    },
    onError: (error) => {
      console.error('Error deleting order:', error)
    }
  })
}
