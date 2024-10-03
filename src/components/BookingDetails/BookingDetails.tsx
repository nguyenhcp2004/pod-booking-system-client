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
  const { bookingInfo } = useBookingContext()

  const roomTotal = bookingInfo.rooms.reduce((total, room) => total + room.price, 0)
  const amenitiesTotal = bookingInfo.rooms.reduce(
    (total, room) => total + room.amenities.reduce((sum, amenity) => sum + amenity.price * amenity.quantity, 0),
    0
  )

  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Typography variant='h6' color='primary' gutterBottom>
        Đơn đặt
      </Typography>
      <Box display='flex' alignItems='center'>
        <img src={bookingInfo.imageSrc} alt={bookingInfo.roomType} width='100' height='100' />
        <Box ml={2}>
          <Typography variant='h6'>{bookingInfo.roomType}</Typography>
          <Typography variant='subtitle1' color='textSecondary'>
            {bookingInfo.pricePerHour.toLocaleString()} VND/tiếng
          </Typography>
          <Typography variant='body2'>Địa chỉ: {bookingInfo.address}</Typography>
          <Typography variant='body2'>Ngày: {bookingInfo.date}</Typography>
          <Typography variant='body2'>Slot: {bookingInfo.timeSlots}</Typography>
          <Typography variant='body2'>Phòng: {bookingInfo.rooms.map((room) => room.name).join(', ')}</Typography>
          <Typography variant='body2'>Gói: {bookingInfo.package}</Typography>
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
            {bookingInfo.rooms.map((room) =>
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
