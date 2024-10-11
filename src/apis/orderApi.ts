import { useQuery } from '@tanstack/react-query'
import { BookingInfo } from '~/contexts/BookingContext'
import http from '~/utils/http'
import { createBookingPayload } from '~/utils/orderUtils'

export enum OrderStatus {
  Pending = 'Pending',
  Successfully = 'Successfully',
  Rejected = 'Rejected'
}

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

interface Account {
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
