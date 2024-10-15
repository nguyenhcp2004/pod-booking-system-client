import { BookingInfo } from '~/contexts/BookingContext'
import http from '~/utils/http'
import { createBookingPayload } from '~/utils/orderUtils'

export const createOrder = async (bookingInfo: BookingInfo) => {
  const payload = createBookingPayload(bookingInfo)
  console.log('Payload:', payload)
  try {
    const response = await http.post('/order', payload)
    return response.data
  } catch (error) {
    console.error('Error generating payment URL:', error)
    throw error
  }
}
