import { createContext, useContext, useState, useEffect } from 'react'
import { ReactNode } from 'react'
import { RoomType2, ServicePackage } from '~/constants/type'

export const BookingContext = createContext<BookingContextType | undefined>(undefined)

export const useBookingContext = () => {
  return useContext(BookingContext)
}

export interface Amenity {
  id: number
  name: string
  price: number
  quantity: number
}

export interface Room2 {
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
  roomType: RoomType2 | null
  selectedRooms: Room2[] | []
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
          roomType: mockRoomType,
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

const mockRoomType: RoomType2 = {
  id: 1,
  name: 'Deluxe Room',
  quantity: 2,
  capacity: 2,
  price: 100000,
  building: {
    id: 1,
    address: 'Thủ Đức',
    description: 'This is a description',
    hotlineNumber: '123456789',
    status: 'Active',
    createdAt: '2021-10-10',
    updatedAt: '2021-10-10'
  }
}
