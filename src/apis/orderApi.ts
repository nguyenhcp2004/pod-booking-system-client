import queryString from 'query-string'
import { Building, Room, RoomTypeFix } from '~/constants/type'
import { BookingInfo } from '~/contexts/BookingContext'
import {
  CountOrderReqType,
  CountOrderResType,
  GetListOrderByAccountIdQueryType,
  GetListOrderByAccountIdResType,
  GetOrderInfoResType,
  OrderUpdateStatusResType
} from '~/schemaValidations/order.schema'
import http from '~/utils/http'
import { createBookingPayload, createBookingPayloadAD, createOrderUpdateRequest } from '~/utils/order'
import { formatQueryDateTime } from '~/utils/utils'

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

export interface OrderDetail {
  id: string
  roomId: number
  roomName: string
  roomPrice: number
  roomImage: string
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

interface orderHandler {
  id: string
  name: string
}

export interface OrderUpdateStaffRequest {
  id: string
  orderHandler: orderHandler
}

interface OrderResponse {
  id: string
  accountId: string
  createdAt: string
  updatedAt: string
}

//Read
export const getPageOrder = async (params: {
  startDate: string
  endDate: string
  page: number
  size: number
  status?: string | null
}) => {
  try {
    const queryParams: { startDate: string; endDate: string; page: number; size: number; status?: string } = {
      startDate: params.startDate,
      endDate: params.endDate,
      page: params.page,
      size: params.size
    }
    if (params.status !== null) {
      queryParams.status = params.status
    }
    const query = queryString.stringify(queryParams)
    const response = await http.get(`/order/page?${query}`)
    return response.data
  } catch (error) {
    console.error('Error getting page order:', error)
    throw error
  }
}

export const searchOrder = async (params: { keyword: string; page: number; size: number }) => {
  try {
    const query = queryString.stringify(params)
    const response = await http.get(`/order/search?${query}`)
    return response.data
  } catch (error) {
    console.error('Error searching accounts:', error)
    throw error
  }
}

//Create
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

export const getBuilding = async (): Promise<Building[]> => {
  try {
    const response = await http.get('/buildings/all')
    return response.data.data
  } catch (error) {
    console.error('Error getting all building:', error)
    throw error
  }
}

export const getRoomType = async (keyword: string): Promise<RoomTypeFix[]> => {
  try {
    const response = await http.get(`/room-types/filtered-room-type?address=${keyword}`)
    return response.data.data
  } catch (error) {
    console.error('Error getting staff:', error)
    throw error
  }
}
export const searchBuilding = async (keyword: string): Promise<Building[]> => {
  try {
    const response = await http.get(`/buildings/search?keyword=${keyword}`)
    return response.data.data
  } catch (error) {
    console.error('Error searching accounts:', error)
    throw error
  }
}

export const searchAccounts = async (keyword: string): Promise<Account[]> => {
  try {
    const response = await http.get(`/accounts/${keyword}/Customer`)
    return response.data
  } catch (error) {
    console.error('Error searching accounts:', error)
    throw error
  }
}

export const getStaff = async (): Promise<Account[]> => {
  try {
    const response = await http.get('/accounts/staff')
    return response.data.data
  } catch (error) {
    console.error('Error getting staff:', error)
    throw error
  }
}

export const getRoomSameType = async ({ roomId }: { roomId: string }): Promise<Room[]> => {
  try {
    const response = await http.get(`/rooms/type/${roomId}`)
    return response.data
  } catch (error) {
    console.error('Error getting staff:', error)
    throw error
  }
}

//Update
export const updateOrderApi = async (order: Order, updateOrder: Order | null, allStatus: OrderStatus | null) => {
  if (updateOrder != null) {
    const updateRequest = createOrderUpdateRequest(order, updateOrder, allStatus)
    if (updateRequest) {
      try {
        const response = await http.put('/order', updateRequest)
        return response.data
      } catch (error) {
        console.error('Error update page order:', error)
        throw error
      }
    } else {
      return { code: 400 }
    }
  }
}

export const updateStaff = async (request: OrderUpdateStaffRequest): Promise<OrderResponse> => {
  try {
    const response = await http.put(`/order-detail/staff`, request)
    return response.data
  } catch (error) {
    console.error('Error updating staff:', error)
    throw error
  }
}

//Delete
export const deleteOrder = async (orderId: string) => {
  try {
    const response = await http.delete(`/order/${orderId}`)
    return response.data
  } catch (error) {
    console.error('Error deleting order:', error)
    throw error
  }
}

export const orderApiRequest = {
  countCurrentOrder: () => http.get<CountOrderResType>('/order/number-order-current-day'),
  countOrder: (query: CountOrderReqType) => {
    const queryString = formatQueryDateTime(query.startTime as string, query.endTime as string)
    return http.get<CountOrderResType>(`/order/number-order?${queryString}`)
  },
  getListOrderByAccountId: (query: GetListOrderByAccountIdQueryType) => {
    const queryObject = {
      page: query.page,
      take: query.take,
      status: query.status
    }
    const stringified = queryString.stringify(queryObject)
    return http.get<GetListOrderByAccountIdResType>(`/order/${query.accountId}?${stringified}`)
  },
  getOrderInfo: (orderId: string) => http.get<GetOrderInfoResType>(`/order/order-info/${orderId}`),
  updateOrderStatus: (body: { id: string; status: string; cancelReason: string }) =>
    http.put<OrderUpdateStatusResType>(`/order`, body)
}

export default orderApiRequest
