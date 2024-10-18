import { useMutation, useQuery } from '@tanstack/react-query'
import { Building, Room, RoomTypeFix } from '~/constants/type'
import { BookingInfo } from '~/contexts/BookingContext'
import http from '~/utils/http'
import { createBookingPayload, createBookingPayloadAD, createOrderUpdateRequest } from '~/utils/orderUtils'

export enum OrderStatus {
  Pending = 'Pending',
  Successfully = 'Successfully',
  Rejected = 'Rejected'
}

export const orderStatus: OrderStatus[] = [OrderStatus.Pending, OrderStatus.Successfully, OrderStatus.Rejected]

enum Role {
  Admin = 'Admin',
  Staff = 'Staff',
  Customer = 'Customer',
  Manager = 'Manager'
}

export interface Order {
  id: string
  createdAt: string
  updatedAt: string
  orderDetails: OrderDetail[]
}

interface OrderDetail {
  id: string
  roomId: number
  roomName: string
  roomPrice: number
  status: OrderStatus
  startTime: string
  endTime: string
  buildingId: number
  buildingAddress: string
  servicePackage: ServicePackage | null
  customer: Account
  orderHandler: Account
  amenities: Amenity[] | []
}

export interface Account {
  id: string
  name: string | null
  email: string
  avatar: string | null
  role: Role
  buildingNumber: number | 0
  rankingName: string | null
}

interface ServicePackage {
  id: string
  name: string
  discountPercentage: number
}

interface Amenity {
  id: string
  name: string
  price: number
  quantity: number
}

export const createOrder = async (bookingInfo: BookingInfo) => {
  const payload = createBookingPayload(bookingInfo)
  try {
    const response = await http.post('/order', payload)
    return response.data
  } catch (error) {
    console.error('Error create order customer side:', error)
    throw error
  }
}

export const createOrderAD = async (bookingInfo: BookingInfo, customer: Account) => {
  const payload = createBookingPayloadAD(bookingInfo, customer)
  try {
    const response = await http.post('/order', payload)
    return response.data
  } catch (error) {
    console.error('Error create order admin side:', error)
    throw error
  }
}

export const updateOrderApi = async (order: Order, updateOrder: Order | null) => {
  if (updateOrder != null) {
    const updateRequest = createOrderUpdateRequest(order, updateOrder)
    if (updateRequest) {
      try {
        const response = await http.put('/order', updateRequest)
        return response.data
      } catch (error) {
        console.error('Error update page order:', error)
        throw error
      }
    } else {
      console.log('Không có thay đổi nào cần gửi.')
      return
    }
  }
}

export const getPageOrder = async (startDate: string, endDate: string, page: number, size: number) => {
  try {
    const response = await http.get(`/order/page?startDate=${startDate}&endDate=${endDate}&page=${page}&size=${size}`)
    return response.data
  } catch (error) {
    console.error('Error getting page order:', error)
    throw error
  }
}

export const useOrders = (startDate: string, endDate: string, page: number, size: number) => {
  return useQuery({
    queryKey: ['orders', startDate, endDate, page, size],
    queryFn: () => getPageOrder(startDate, endDate, page, size),
    enabled: !!startDate && !!endDate
  })
}

const getStaff = async (): Promise<Account[]> => {
  try {
    const response = await http.get('/accounts/staff')
    return response.data
  } catch (error) {
    console.error('Error getting staff:', error)
    throw error
  }
}

export const useStaffAccounts = () => {
  return useQuery({
    queryKey: ['staffAccounts'],
    queryFn: getStaff
  })
}

const getBuilding = async (): Promise<Building[]> => {
  try {
    const response = await http.get('/buildings/all')
    return response.data.data
  } catch (error) {
    console.error('Error getting staff:', error)
    throw error
  }
}

export const useBuilding = () => {
  return useQuery({
    queryKey: ['building'],
    queryFn: getBuilding
  })
}

const getRoomType = async (keyword: string): Promise<RoomTypeFix[]> => {
  try {
    const response = await http.get(`/room-types/filtered-room-type?address=${keyword}`)
    return response.data.data
  } catch (error) {
    console.error('Error getting staff:', error)
    throw error
  }
}

export const useRoomType = (keyword: string) => {
  return useQuery({
    queryKey: ['roomType', keyword],
    queryFn: () => getRoomType(keyword),
    enabled: !!keyword
  })
}

const searchBuilding = async (keyword: string): Promise<Building[]> => {
  try {
    const response = await http.get(`/buildings/search?keyword=${keyword}`)
    return response.data.data
  } catch (error) {
    console.error('Error searching accounts:', error)
    throw error
  }
}

export const useSearchBuilding = (keyword: string) => {
  return useQuery({
    queryKey: ['searchBuilding', keyword],
    queryFn: () => searchBuilding(keyword),
    enabled: !!keyword
  })
}

interface orderHandler {
  id: string
  name: string
}

interface OrderUpdateStaffRequest {
  id: string
  orderHandler: orderHandler
}

interface OrderResponse {
  id: string
  accountId: string
  createdAt: string
  updatedAt: string
}

const updateStaff = async (request: OrderUpdateStaffRequest): Promise<OrderResponse> => {
  try {
    const response = await http.put(`http://localhost:8080/order`, request)
    return response.data
  } catch (error) {
    console.error('Error updating staff:', error)
    throw error
  }
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

const searchAccounts = async (keyword: string): Promise<Account[]> => {
  try {
    const response = await http.get(`/accounts/${keyword}/Customer`)
    return response.data
  } catch (error) {
    console.error('Error searching accounts:', error)
    throw error
  }
}

export const useSearchAccounts = (keyword: string) => {
  return useQuery({
    queryKey: ['searchAccounts', keyword],
    queryFn: () => searchAccounts(keyword),
    enabled: !!keyword
  })
}

const searchOrder = async (keyword: string, page: number, size: number) => {
  try {
    const response = await http.get(`/order/search?keyword=${keyword}&page=${page}&size=${size}`)
    return response.data
  } catch (error) {
    console.error('Error searching accounts:', error)
    throw error
  }
}

export const useSearchOrder = (keyword: string, page: number, size: number) => {
  return useQuery({
    queryKey: ['searchOrder', keyword, page, size],
    queryFn: () => searchOrder(keyword, page, size),
    enabled: !!keyword
  })
}

const deleteOrder = async (orderId: string) => {
  try {
    const response = await http.delete(`/order/${orderId}`)
    return response.data
  } catch (error) {
    console.error('Error deleting order:', error)
    throw error
  }
}

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

const getRoomSameType = async ({ roomId }: { roomId: string }): Promise<Room[]> => {
  try {
    const response = await http.get(`/rooms/type/${roomId}`)
    return response.data
  } catch (error) {
    console.error('Error getting staff:', error)
    throw error
  }
}

export const useRoomSameType = (roomId: string) => {
  return useQuery({
    queryKey: ['roomByTypeId', roomId],
    queryFn: () => getRoomSameType({ roomId }),
    enabled: !!roomId
  })
}
