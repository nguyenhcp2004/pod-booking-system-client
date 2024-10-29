import { useMutation, useQuery } from '@tanstack/react-query'
import orderApiRequest, {
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
import { CountOrderReqType, GetListOrderByAccountIdQueryType } from '~/schemaValidations/order.schema'

//Read
export const useOrders = (params: {
  startDate: string
  endDate: string
  page: number
  size: number
  status?: string | null
}) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => getPageOrder(params),
    enabled: !!params.startDate && !!params.endDate
  })
}

export const useSearchOrder = (params: { keyword: string; page: number; size: number }) => {
  return useQuery({
    queryKey: ['searchOrder', params],
    queryFn: () => searchOrder(params),
    enabled: !!params.keyword
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

export const useCountCurrentOrder = () => {
  return useQuery({
    queryKey: ['count-current-orders'],
    queryFn: () => orderApiRequest.countCurrentOrder()
  })
}

export const useCountOrder = (query: CountOrderReqType) => {
  return useQuery({
    queryKey: ['count-orders', query],
    queryFn: () => orderApiRequest.countOrder(query),
    enabled: !!query.startTime && !!query.endTime
  })
}

export const useGetListOrderByAccountId = (query: GetListOrderByAccountIdQueryType) => {
  return useQuery({
    queryKey: ['order-of-account', { query }],
    queryFn: () => orderApiRequest.getListOrderByAccountId(query)
  })
}

export const useGetOrderInfo = (orderId: string) => {
  return useQuery({
    queryKey: ['order-info', orderId],
    queryFn: () => orderApiRequest.getOrderInfo(orderId)
  })
}
