/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'
import { ReactNode } from 'react'
import { RoomTypeFix, ServicePackage } from '~/constants/type'

export const BookingContext = createContext<BookingContextType | undefined>(undefined)

export const useBookingContext = () => {
  const context = useContext(BookingContext)
  if (context === undefined) {
    throw new Error('useBookingContext must be used within a BookingProvider')
  }
  return context
}

export interface Amenity {
  id: number
  name: string
  price: number
  quantity: number
}

export interface RoomContextType {
  id: number
  name: string
  price: number | undefined
  image: string
  amenities: Amenity[]
}

interface BookingContextType {
  bookingData: BookingInfo
  setBookingData: React.Dispatch<React.SetStateAction<BookingInfo>>
}

interface BookingProviderProps {
  children: ReactNode
}

export type slotType =
  | '07:00 - 09:00'
  | '09:00 - 11:00'
  | '11:00 - 13:00'
  | '13:00 - 15:00'
  | '15:00 - 17:00'
  | '17:00 - 19:00'
  | '19:00 - 21:00'

export interface BookingInfo {
  roomType: RoomTypeFix | null
  selectedRooms: RoomContextType[] | []
  date: string | null
  timeSlots: slotType[] | []
  servicePackage: ServicePackage | null
}

const LOCAL_STORAGE_KEY = 'bookingData'

export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const [bookingData, setBookingData] = useState<BookingInfo>(() => {
    const savedBookingData = localStorage.getItem(LOCAL_STORAGE_KEY)
    return savedBookingData
      ? JSON.parse(savedBookingData)
      : {
          roomType: null,
          selectedRooms: [],
          date: null,
          timeSlots: [],
          servicePackage: null
        }
  })

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bookingData))
  }, [bookingData])

  return <BookingContext.Provider value={{ bookingData, setBookingData }}>{children}</BookingContext.Provider>
}
