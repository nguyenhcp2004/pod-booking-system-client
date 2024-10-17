import { useMutation, useQuery } from '@tanstack/react-query'
import { Building, RoomTypeFix } from '~/constants/type'
import { BookingInfo } from '~/contexts/BookingContext'
import http from '~/utils/http'
import { createBookingPayload } from '~/utils/orderUtils'

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
  console.log('Payload:', payload)
  try {
    const response = await http.post('/order', payload)
    return response.data
  } catch (error) {
    console.error('Error generating payment URL:', error)
    throw error
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

const updateStaff = async (orderId: string, request: OrderUpdateStaffRequest): Promise<OrderResponse> => {
  try {
    const response = await http.put(`http://localhost:8080/order/${orderId}`, request)
    return response.data
  } catch (error) {
    console.error('Error updating staff:', error)
    throw error
  }
}

export const useUpdateStaff = () => {
  return useMutation({
    mutationFn: ({ orderId, request }: { orderId: string; request: OrderUpdateStaffRequest }) =>
      updateStaff(orderId, request),
    onSuccess: () => {
      console.log('Staff updated successfully')
    },
    onError: (error) => {
      console.error('Error updating staff:', error)
    }
  })
}

const searchAccounts = async (keyword: string): Promise<Account[]> => {
  try {
    const response = await http.get(`/accounts/${keyword}/Customer`)
    console.log('Search accounts:', response.data)
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
    console.log(`/order/search?keyword=${keyword}&page=${page}&size=${size}`)
    const response = await http.get(`/order/search?keyword=${keyword}&page=${page}&size=${size}`)
    console.log('Search order:', response.data)
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
