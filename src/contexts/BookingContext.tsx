import { createContext, useContext, useState } from 'react'
import { ReactNode } from 'react'

export const BookingContext = createContext<BookingContextType | undefined>(undefined)

export const useBookingContext = () => {
  return useContext(BookingContext)
}

interface RoomType {
  id: number
  name: string
  building: Building
}

interface Building {
  id: number
  address: string
}

interface ServicePackage {
  id: number
  name: string
  discountPercentage: number
}

interface Amenity {
  id: number
  name: string
  price: number
  quantity: number
}

export interface Room {
  id: number
  name: string
  price: number
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

export interface BookingInfo {
  roomType: RoomType | null
  selectedRooms: Room[] | []
  date: string | null
  timeSlots: number[] | []
  servicePackage: ServicePackage | null
}

// export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
//   const [bookingData, setBookingData] = useState<BookingInfo>({
//     roomType: null,
//     selectedRooms: [],
//     date: null,
//     timeSlots: [],
//     servicePackage: null
//   })

//   return <BookingContext.Provider value={{ bookingData, setBookingData }}>{children}</BookingContext.Provider>
// }
const mockRoomType: RoomType = {
  id: 1,
  name: 'Deluxe Room',
  building: {
    id: 1,
    address: '123 Main St'
  }
}

const mockServicePackage: ServicePackage = {
  id: 1,
  name: 'Standard Package',
  discountPercentage: 10
}

const mockRooms: Room[] = [
  {
    id: 1,
    name: 'Room A',
    price: 100,
    image: 'roomA.jpg',
    amenities: [
      { id: 1, name: 'WiFi', price: 5, quantity: 1 },
      { id: 2, name: 'Breakfast', price: 15, quantity: 1 }
    ]
  },
  {
    id: 2,
    name: 'Room B',
    price: 120,
    image: 'roomB.jpg',
    amenities: [
      { id: 1, name: 'WiFi', price: 5, quantity: 1 },
      { id: 3, name: 'Parking', price: 10, quantity: 1 }
    ]
  }
]

export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const [bookingData, setBookingData] = useState<BookingInfo>({
    roomType: mockRoomType,
    selectedRooms: mockRooms,
    date: '2024-10-15',
    timeSlots: [1, 2],
    servicePackage: mockServicePackage
  })

  return <BookingContext.Provider value={{ bookingData, setBookingData }}>{children}</BookingContext.Provider>
}
