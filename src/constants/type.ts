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
  capacity: number
  building: Building
}

export type Room = {
  id: number
  name: string
  price: number
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
