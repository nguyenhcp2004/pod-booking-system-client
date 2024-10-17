import moment from 'moment'
import { Order } from '~/apis/orderApi'
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
  let selectedSlot = null
  const startTime = []
  const endTime = []
  for (let i = 0; i < bookingData.timeSlots.length; i++) {
    selectedSlot = bookingData.timeSlots[i]
    if (bookingData.date && selectedSlot) {
      const dateTime = createDateTimeFromSlot(bookingData.date, selectedSlot)
      startTime.push(dateTime.startTime)
      endTime.push(dateTime.endTime)
    }
  }

  if (startTime.length === 0 || endTime.length === 0) {
    return null
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
    priceRoom: Math.round(bookingData.roomType?.price || 0),
    startTime,
    endTime
  }
}

export const mapOrderToRow = (order: Order) => ({
  order: order,
  id: order.id,
  customer: order.orderDetails?.[0]?.customer?.name || 'N/A',
  createdAt: moment(order.createdAt).format('HH:mm DD-MM-YY') || 'N/A',
  updatedAt: moment(order.updatedAt).format('HH:mm DD-MM-YY') || 'N/A',
  roomName: [...new Set(order.orderDetails.map((o) => o.roomName))].join(', ') || 'N/A',
  address: order.orderDetails?.[0]?.buildingAddress || 'N/A',
  status: order.orderDetails?.[0]?.status || 'N/A',
  startTime: moment(order.orderDetails?.[0]?.startTime).format('HH:mm DD-MM') || 'N/A',
  endTime: new Date(order.orderDetails?.[0]?.endTime).toLocaleString() || 'N/A',
  servicePackage: order.orderDetails?.[0]?.servicePackage?.name || 'N/A',
  orderHandler: order.orderDetails[0]?.orderHandler || null,
  staffId: order.orderDetails[0]?.orderHandler?.id || null,
  slots:
    [
      ...new Set(
        order.orderDetails.map(
          (orderDetail) =>
            `${moment(orderDetail.startTime).format('HH:mm')} - ${moment(orderDetail.endTime).format('HH:mm')}`
        )
      )
    ].join(', ') || 'N/A'
})
