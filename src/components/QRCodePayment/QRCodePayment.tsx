import { Paper, Typography, Box } from '@mui/material'
import { useBookingContext } from '~/contexts/BookingContext'

const QRCodePayment = () => {
  const bookingContext = useBookingContext()
  const bookingData = bookingContext?.bookingData

  if (!bookingData) return null

  const roomTotal = bookingData.selectedRooms.reduce((total, room) => total + room.price, 0)
  const amenitiesTotal = bookingData.selectedRooms.reduce(
    (total, room) => total + room.amenities.reduce((sum, amenity) => sum + amenity.price * amenity.quantity, 0),
    0
  )
  let discountAmount = 0
  if (bookingData.servicePackage && bookingData.servicePackage.discountPercentage) {
    discountAmount = (roomTotal + amenitiesTotal) * (bookingData.servicePackage.discountPercentage / 100)
  }
  const grandTotal = roomTotal + amenitiesTotal - discountAmount

  return (
    <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
      <Typography variant='h6' gutterBottom>
        Thanh toán bằng QR Code
      </Typography>

      <Box sx={{ width: '200px', height: '200px', bgcolor: 'gray' }}>
        <img src='path-to-qr-code' alt='QR Code' />
      </Box>

      <Typography variant='body2' sx={{ mt: 2 }}>
        Giao dịch hết hạn sau 14:30
      </Typography>

      <Typography variant='h4' color='primary' sx={{ mt: 2 }}>
        {grandTotal.toLocaleString()} VND
      </Typography>
    </Paper>
  )
}

export default QRCodePayment
