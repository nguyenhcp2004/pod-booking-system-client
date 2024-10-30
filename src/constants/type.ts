import type { Theme, SxProps } from '@mui/material/styles'
import type { Props as SimplebarProps } from 'simplebar-react'

export type AccountRoleType = (typeof AccountRole)[keyof typeof AccountRole]
export const AccountRole = {
  Admin: 'Admin',
  Customer: 'Customer',
  Manager: 'Manager',
  Staff: 'Staff'
} as const

export interface TokenPayload {
  accountId: string
  exp: number
  iat: number
  scope: AccountRoleType
}

export type ServicePackage = {
  id: string
  name: string
  discountPercentage: number
}

export type Slot = {
  startTime: string
  endTime: string
}

export type SlotAvailable = {
  startTime: string
  endTime: string

  available: boolean
}

export type Building = {
  id: number
  address: string
  description: string
  hotlineNumber: string
  status: string
  createdAt: string
  updatedAt: string
}

export type RoomTypeFix = {
  id: number
  name: string
  price: number
  quantity: number
  capacity: number
  building: Building
}

export type RoomType = {
  id: number
  name: string
  quantity: number
  price: number
  capacity: number
  building: Building
}

export type Room = {
  id: number
  name: string
  description: string
  image: string
  status: string
  createdAt: string
  updatedAt: string
  roomType: RoomType
}

export type ScrollbarProps = SimplebarProps & {
  sx?: SxProps<Theme>
  children?: React.ReactNode
  fillContent?: boolean
  slotProps?: {
    wrapper?: SxProps<Theme>
    contentWrapper?: SxProps<Theme>
    content?: Partial<SxProps<Theme>>
  }
}

export type Pagination = {
  page: number
  take: number
}

export type Amenity = {
  id: number
  name: string
  price: number
  quantity: number
  type: string
  imageUrl: string
}

export const CanceledReason = {
  REASON_1: 'Đặt phòng không được xác nhận kịp thời',
  REASON_2: 'Không thật sự tin tưởng vào uy tín của dịch vụ chúng tôi',
  REASON_3: 'Lo lắng về sự an toàn cho vị trí phòng đặt',
  REASON_4: 'Quyết định chọn phòng khác không có trên FlexiPod',
  REASON_5: 'Không thích chính sách hủy phòng',
  REASON_6: 'Không hài lòng với cách thanh toán',
  REASON_7: 'Buộc phải hủy phòng hay hoãn lịch',
  REASON_8: 'Tìm thấy giá thấp hơn trên mạng',
  REASON_9: 'Tìm được giá thấp hơn qua dịch vụ địa phương',
  REASON_10: 'Sẽ đặt phòng khác trên website của chúng tôi',
  REASON_11: 'Sẽ đặt phòng trực tiếp với chi nhánh',
  REASON_12: 'Khác'
}
