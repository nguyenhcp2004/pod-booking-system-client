import moment from 'moment'
import { Account, Order, OrderStatus } from '~/apis/orderApi'
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

  if (!startTime || !endTime || startTime.length === 0 || endTime.length === 0) {
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

export const createBookingPayloadAD = (bookingData: BookingInfo, customer: Account) => {
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

  if (!startTime || !endTime || startTime.length === 0 || endTime.length === 0) {
    return null
  }

  return {
    customer: {
      id: customer.id,
      name: customer.name
    },
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

export const mapOrderToRow = (order: Order) => {
  const slots = [
    ...new Set(
      order.orderDetails.map(
        (orderDetail) =>
          `${moment(orderDetail.startTime).format('HH:mm')} - ${moment(orderDetail.endTime).format('HH:mm')}`
      )
    )
  ]

  const sortedSlots = slots.sort((a, b) => {
    const aStartTime = moment(a.split(' - ')[0], 'HH:mm')
    const bStartTime = moment(b.split(' - ')[0], 'HH:mm')
    return aStartTime.diff(bStartTime)
  })
  return {
    order: order,
    id: order.id,
    customer: order.orderDetails?.[0]?.customer?.name || 'N/A',
    createdAt: moment(order.createdAt).format('HH:mm DD-MM-YY') || 'N/A',
    updatedAt: moment(order.updatedAt).format('HH:mm DD-MM-YY') || 'N/A',
    roomName: [...new Set(order.orderDetails.map((o) => o.roomName))].join(', ') || 'N/A',
    buildingNumber: order.orderDetails?.[0]?.buildingId || 0,
    address: order.orderDetails?.[0]?.buildingAddress || 'N/A',
    status: order.orderDetails?.[0]?.status || 'N/A',
    startTime: moment(order.orderDetails?.[0]?.startTime).format('HH:mm DD-MM') || 'N/A',
    endTime: new Date(order.orderDetails?.[0]?.endTime).toLocaleString() || 'N/A',
    servicePackage: order.orderDetails?.[0]?.servicePackage?.name || 'N/A',
    orderHandler: order.orderDetails[0]?.orderHandler || null,
    staffId: order.orderDetails[0]?.orderHandler?.id || null,
    slots: sortedSlots.join(', ') || 'N/A'
  }
}

export interface OrderUpdateRequest {
  id: string
  status?: OrderStatus
  orderHandler?: Account
  orderDetails?: OrderDetailUpdateRoomRequest[]
}

export interface OrderDetailUpdateRoomRequest {
  id: string
  roomId: number
}

export const createOrderUpdateRequest = (currentOrder: Order, updatedOrder: Order): OrderUpdateRequest | null => {
  const orderDetails: OrderDetailUpdateRoomRequest[] = []

  updatedOrder.orderDetails.forEach((updatedDetail) => {
    const originalDetail = currentOrder.orderDetails.find((detail) => detail.id === updatedDetail.id)

    if (originalDetail && originalDetail.roomId !== updatedDetail.roomId) {
      orderDetails.push({
        id: updatedDetail.id,
        roomId: updatedDetail.roomId
      })
    }
  })

  const request: OrderUpdateRequest = {
    id: updatedOrder.id,
    ...(currentOrder.orderDetails[0].status !== updatedOrder.orderDetails[0].status && {
      status: updatedOrder.orderDetails[0].status
    }),
    ...(currentOrder.orderDetails[0]?.orderHandler?.id !== updatedOrder.orderDetails[0]?.orderHandler?.id && {
      orderHandler: updatedOrder.orderDetails[0]?.orderHandler
    }),
    ...(orderDetails.length > 0 && { orderDetails })
  }
  return Object.keys(request).length > 1 ? request : null
}

export const calTotalPrice = (bookingData: BookingInfo) => {
  let packageRepeat = 0
  if (bookingData?.servicePackage) {
    switch (bookingData?.servicePackage?.id.toString()) {
      case '1':
        packageRepeat = 4
        break
      case '2':
        packageRepeat = 30
        break
      case '3':
        packageRepeat = 1
        break
    }
  }

  const roomPrice = bookingData?.roomType?.price ?? 0
  const totalRoomPrice = Math.round(roomPrice * bookingData?.selectedRooms.length * packageRepeat)

  const totalAmenitiesPrice = Math.round(
    bookingData?.selectedRooms.reduce((acc, room) => {
      return (
        acc +
        room.amenities.reduce((amenityAcc, amenity) => {
          return amenityAcc + amenity.price * amenity.quantity * packageRepeat
        }, 0)
      )
    }, 0) || 0
  )

  const discount = Math.round(
    ((bookingData?.servicePackage?.discountPercentage ?? 0) * (totalRoomPrice + totalAmenitiesPrice)) / 100
  )

  const total = Math.round(totalRoomPrice + totalAmenitiesPrice - discount)

  return {
    total,
    totalRoomPrice,
    totalAmenitiesPrice,
    discount,
    packageRepeat
  }
}
