import { BookingInfo, slotType } from '~/contexts/BookingContext'

export const createDateTimeFromSlot = (date: string, slot: slotType) => {
  const [startTimeString, endTimeString] = slot.split(' - ')

  const startTime = new Date(`${date}T${startTimeString}:00`)
  const endTime = new Date(`${date}T${endTimeString}:00`)

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('sv-SE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
      .format(date)
      .replace(' ', 'T')
  }

  return {
    startTime: formatDateTime(startTime),
    endTime: formatDateTime(endTime)
  }
}

export const createBookingPayload = (bookingData: BookingInfo) => {
  const selectedSlot = bookingData.timeSlots[0]

  let startTime = null
  let endTime = null

  if (bookingData.date && selectedSlot) {
    const dateTime = createDateTimeFromSlot(bookingData.date, selectedSlot)
    startTime = dateTime.startTime
    endTime = dateTime.endTime
  }

  return {
    building: {
      id: bookingData.roomType?.building.id,
      address: bookingData.roomType?.building.address
    },
    selectedRooms: bookingData.selectedRooms.map((room) => ({
      id: room.id,
      name: room.name,
      price: room.price,
      image: room.image,
      amenities: room.amenities.map((amenity) => ({
        id: amenity.id,
        name: amenity.name,
        price: amenity.price,
        quantity: amenity.quantity
      }))
    })),
    servicePackage: bookingData.servicePackage
      ? {
          id: bookingData.servicePackage.id,
          name: bookingData.servicePackage.name,
          discountPercentage: bookingData.servicePackage.discountPercentage
        }
      : null,
    orderHandler: {
      id: '55513f59-b2e9-41be-a989-0aa692df827a',
      name: 'Admin'
    },
    priceRoom: Math.round(bookingData.roomType?.price || 0),
    discountPercentage: bookingData.servicePackage?.discountPercentage || 0,
    startTime,
    endTime
  }
}
