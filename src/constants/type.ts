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

export type RoomType2 = {
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
