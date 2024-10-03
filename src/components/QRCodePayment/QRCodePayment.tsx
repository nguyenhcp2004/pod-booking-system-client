import { Typography, Box, useTheme } from '@mui/material'
import { useBookingContext } from '~/contexts/BookingContext'

const QRCodePayment = () => {
  const bookingContext = useBookingContext()
  const bookingData = bookingContext?.bookingData
  const theme = useTheme()

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
    <Box
      sx={{
        bgcolor: 'white',
        padding: 2,
        textAlign: 'center',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px'
      }}
    >
      <Typography variant='h5' gutterBottom>
        Thanh toán bằng QR Code
      </Typography>

      <Box sx={{ width: '240px', height: '240px', border: '1px solid black' }}>
        <img src='path-to-qr-code' alt='QR Code' />
      </Box>
      <Typography variant='body2'>Giao dịch hết hạn sau 14:30</Typography>
      <Typography variant='subtitle1' color={theme.palette.primary.main} fontWeight='bold'>
        {grandTotal.toLocaleString()} VND
      </Typography>
    </Box>
  )
}

export default QRCodePayment
