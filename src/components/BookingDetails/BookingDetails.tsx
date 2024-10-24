import { useBookingContext } from '~/contexts/BookingContext'
import BookingDetailsCustom from '../AminManageOrder/CreateOrderComponents/BookingDetailsCustom'

const BookingDetails = () => {
  const bookingContext = useBookingContext()
  const bookingData = bookingContext!.bookingData
  const setBookingData = bookingContext?.setBookingData
  if (!bookingData) return null
  return <BookingDetailsCustom bookingData={bookingData} setBookingData={setBookingData} />
}

export default BookingDetails
