import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { AmenityType } from '~/schemaValidations/amenity.schema'
import { BookedRoomSchemaType } from '~/schemaValidations/room.schema'

interface BookingAmenityContextType {
  selectedAmenities: AmenityType[]
  bookedRoom: BookedRoomSchemaType | null
  setBookedRoom: (room: BookedRoomSchemaType | null) => void
  addAmenity: (amenity: AmenityType) => void
  removeAmenity: (amenityId: number) => void
  updateAmenityQuantity: (amenityId: number, quantity: number) => void
  clearAmenities: () => void
  calculateTotal: () => number
}

const BookingAmenityContext = createContext<BookingAmenityContextType | undefined>(undefined)

export const useBookingAmenityContext = () => {
  const context = useContext(BookingAmenityContext)
  if (!context) {
    throw new Error('useBookingAmenityContext must be used within a BookingAmenityProvider')
  }
  return context
}

interface BookingAmenityProviderProps {
  children: ReactNode
}

const LOCAL_STORAGE_KEY_AMENITIES = 'bookingAmenities'
const LOCAL_STORAGE_KEY_ROOM = 'bookedRoom'

export const BookingAmenityProvider: React.FC<BookingAmenityProviderProps> = ({ children }) => {
  const [selectedAmenities, setSelectedAmenities] = useState<AmenityType[]>(() => {
    const savedAmenities = localStorage.getItem(LOCAL_STORAGE_KEY_AMENITIES)
    return savedAmenities ? JSON.parse(savedAmenities) : []
  })

  const [bookedRoom, setBookedRoom] = useState<BookedRoomSchemaType | null>(() => {
    const savedRoom = localStorage.getItem(LOCAL_STORAGE_KEY_ROOM)
    return savedRoom ? JSON.parse(savedRoom) : null
  })

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_AMENITIES, JSON.stringify(selectedAmenities))
  }, [selectedAmenities])

  useEffect(() => {
    if (bookedRoom) {
      localStorage.setItem(LOCAL_STORAGE_KEY_ROOM, JSON.stringify(bookedRoom))
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY_ROOM)
    }
  }, [bookedRoom])

  const addAmenity = (amenity: AmenityType) => {
    setSelectedAmenities((prevAmenities) => {
      const existingAmenityIndex = prevAmenities.findIndex((a) => a.id === amenity.id)
      if (existingAmenityIndex !== -1) {
        const updatedAmenities = [...prevAmenities]
        updatedAmenities[existingAmenityIndex].quantity += amenity.quantity
        return updatedAmenities
      } else {
        return [...prevAmenities, amenity]
      }
    })
  }

  const removeAmenity = (amenityId: number) => {
    setSelectedAmenities((prevAmenities) => prevAmenities.filter((a) => a.id !== amenityId))
  }

  const updateAmenityQuantity = (amenityId: number, quantity: number) => {
    setSelectedAmenities((prevAmenities) => prevAmenities.map((a) => (a.id === amenityId ? { ...a, quantity } : a)))
  }

  const clearAmenities = () => {
    setSelectedAmenities([])
  }

  const calculateTotal = () => {
    const amenitiesTotal = selectedAmenities.reduce((total, amenity) => total + amenity.price * amenity.quantity, 0)
    const discount = bookedRoom?.servicePackage.discountPercentage
      ? (amenitiesTotal * bookedRoom.servicePackage.discountPercentage) / 100
      : 0
    return amenitiesTotal - discount
  }

  const value: BookingAmenityContextType = {
    selectedAmenities,
    bookedRoom,
    setBookedRoom,
    addAmenity,
    removeAmenity,
    updateAmenityQuantity,
    clearAmenities,
    calculateTotal
  }

  return <BookingAmenityContext.Provider value={value}>{children}</BookingAmenityContext.Provider>
}
