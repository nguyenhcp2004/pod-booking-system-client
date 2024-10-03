import { Paper, Typography, Box } from '@mui/material'
import { useBookingContext } from '~/contexts/BookingContext'

const QRCodePayment = () => {
  const { bookingInfo } = useBookingContext()

  const roomTotal = bookingInfo.rooms.reduce((total, room) => total + room.price, 0)
  const amenitiesTotal = bookingInfo.rooms.reduce(
    (total, room) => total + room.amenities.reduce((sum, amenity) => sum + amenity.price * amenity.quantity, 0),
    0
  )
  const discountAmount = (roomTotal + amenitiesTotal) * (bookingInfo.discountPercent / 100)
  const grandTotal = roomTotal + amenitiesTotal - discountAmount

  return (
    <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
      <Typography variant='h6' gutterBottom>
        Thanh toán bằng QR Code
      </Typography>

      <Box>
        <img src='path-to-qr-code' alt='QR Code' width='200' height='200' />
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
