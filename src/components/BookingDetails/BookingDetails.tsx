import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TableHead,
  Divider
} from '@mui/material'
import { useBookingContext } from '~/contexts/BookingContext'

const BookingDetails = () => {
  const bookingContext = useBookingContext()
  const bookingData = bookingContext?.bookingData

  if (!bookingData) return null 

  const roomTotal = bookingData.selectedRooms.reduce((total, room) => total + room.price, 0)
  const amenitiesTotal = bookingData.selectedRooms.reduce(
    (total, room) => total + room.amenities.reduce((sum, amenity) => sum + amenity.price * amenity.quantity, 0),
    0
  )

  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Typography variant='h6' color='primary' gutterBottom>
        Đơn đặt
      </Typography>
      <Box display='flex' alignItems='center'>
        <img src={bookingData.selectedRooms[0].image} alt={bookingData.roomType?.name} width='100' height='100' />
        <Box ml={2}>
          <Typography variant='h6'>{bookingData.roomType?.name}</Typography>
          <Typography variant='subtitle1' color='textSecondary'>
            {bookingData.selectedRooms[0].price.toLocaleString()} VND/tiếng
          </Typography>
          <Typography variant='body2'>Địa chỉ: {bookingData.roomType?.building.address}</Typography>
          <Typography variant='body2'>Ngày: {bookingData.date}</Typography>
          <Typography variant='body2'>Slot: {bookingData.timeSlots}</Typography>
          <Typography variant='body2'>
            Phòng: {bookingData.selectedRooms.map((room) => room.name).join(', ')}
          </Typography>
          <Typography variant='body2'>Gói: {bookingData.servicePackage?.name}</Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />
      <Typography variant='h6' gutterBottom>
        Tiện ích bạn đã chọn
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Phòng</TableCell>
              <TableCell align='right'>Tiện ích</TableCell>
              <TableCell align='right'>Số lượng</TableCell>
              <TableCell align='right'>Giá</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookingData.selectedRooms.map((room) =>
              room.amenities.map((amenity, index) => (
                <TableRow key={index}>
                  {index === 0 && <TableCell rowSpan={room.amenities.length}>{room.name}</TableCell>}
                  <TableCell align='right'>{amenity.name}</TableCell>
                  <TableCell align='right'>{amenity.quantity}</TableCell>
                  <TableCell align='right'>{(amenity.price * amenity.quantity).toLocaleString()} VND</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider sx={{ my: 2 }} />

      <Typography variant='body1'>Tổng giá các phòng: {roomTotal.toLocaleString()} VND</Typography>
      <Typography variant='body1'>Tổng giá các tiện ích: {amenitiesTotal.toLocaleString()} VND</Typography>
    </Paper>
  )
}

export default BookingDetails
