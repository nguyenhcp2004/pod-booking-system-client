import React, { createContext, useContext, useState, ReactNode } from 'react'

interface Amenity {
  name: string
  quantity: number
  price: number
}

interface Room {
  name: string
  price: number
  amenities: Amenity[]
}

interface BookingInfo {
  roomType: string
  pricePerHour: number
  address: string
  date: string
  timeSlots: string
  package: string
  rooms: Room[]
  discountPercent: number
}

interface BookingContextType {
  bookingInfo: BookingInfo
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export const useBookingContext = () => {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBookingContext must be used within a BookingProvider')
  }
  return context
}

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [bookingInfo] = useState<BookingInfo>({
    roomType: 'Phòng POD đôi',
    pricePerHour: 20000,
    address: 'Đố m biết',
    date: '24/01/2024',
    timeSlots: '7h - 9h, 9h - 11h',
    package: 'Gói tuần',
    rooms: [
      {
        name: 'Phòng 101',
        price: 640000,
        amenities: [
          { name: 'Máy chiếu', quantity: 1, price: 40000 },
          { name: 'Bạc xỉu', quantity: 2, price: 28000 }
        ]
      },
      {
        name: 'Phòng 102',
        price: 640000,
        amenities: [
          { name: 'Máy chiếu', quantity: 1, price: 40000 },
          { name: 'Bạc xỉu', quantity: 2, price: 28000 }
        ]
      }
    ],
    discountPercent: 10
  })

  return <BookingContext.Provider value={{ bookingInfo }}>{children}</BookingContext.Provider>
}
