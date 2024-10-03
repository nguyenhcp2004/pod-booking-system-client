import { Box, Typography, Divider, useTheme, Avatar } from '@mui/material'
import { useBookingContext } from '~/contexts/BookingContext'
import RoomAmenitiesCard from './RoomAmenitiesCard'

const BookingDetails = () => {
  const bookingContext = useBookingContext()
  const bookingData = bookingContext?.bookingData
  const theme = useTheme()

  if (!bookingData) return null

  const roomTotal = bookingData.selectedRooms.reduce((total, room) => total + room.price, 0)
  const amenitiesTotal = bookingData.selectedRooms.reduce(
    (total, room) => total + room.amenities.reduce((sum, amenity) => sum + amenity.price * amenity.quantity, 0),
    0
  )

  return (
    <Box sx={{ bgcolor: 'white' }}>
      <Box sx={{ padding: '20px' }}>
        <Typography variant='h5' color={theme.palette.primary.main} gutterBottom fontWeight='bold'>
          Đơn đặt
        </Typography>
        <Box display='flex' alignItems='center' sx={{ marginTop: '24px' }} gap='20px'>
          <Avatar
            src={bookingData.selectedRooms[0].image}
            alt={bookingData.roomType?.name}
            sx={{ width: '200px', height: '193px', borderRadius: '16px' }}
            variant='rounded'
          />
          <Box
            sx={{
              minHeight: '193px',
              display: 'flex',
              justifyContent: 'flex-start',
              flexDirection: 'column'
            }}
          >
            <Typography variant='h5' fontWeight='bold'>
              {bookingData.roomType?.name}
            </Typography>
            <Box display='flex' sx={{ marginTop: '4px' }}>
              <Typography variant='subtitle2' color={theme.palette.primary.main}>
                {bookingData.selectedRooms[0].price} VND
              </Typography>
              <Typography variant='subtitle2'>/tiếng</Typography>
            </Box>
            <Box sx={{ marginTop: '12px' }} flexDirection='column' display='flex' gap='12px'>
              <Box display='flex' gap='3px'>
                <Typography variant='body2' fontWeight='bold'>
                  Địa chỉ:
                </Typography>
                <Typography variant='body2'> {bookingData.roomType?.building.address}</Typography>
              </Box>
              <Box display='flex' gap='3px'>
                <Typography variant='body2' fontWeight='bold'>
                  Ngày:
                </Typography>
                <Typography variant='body2'>{bookingData.date}</Typography>
              </Box>
              <Box display='flex' gap='3px'>
                <Typography variant='body2' fontWeight='bold'>
                  Slot:
                </Typography>
                <Typography variant='body2'>{bookingData.timeSlots}</Typography>
              </Box>
              <Box display='flex' gap='3px'>
                <Typography variant='body2' fontWeight='bold'>
                  Phòng:
                </Typography>
                <Typography variant='body2'>{bookingData.selectedRooms.map((room) => room.name).join(', ')}</Typography>
              </Box>
              <Box display='flex' gap='3px'>
                <Typography variant='body2' fontWeight='bold'>
                  Gói:
                </Typography>
                <Typography variant='body2'>{bookingData.servicePackage?.name}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box sx={{ marginTop: '24px', paddingY: '20px' }}>
          <Typography variant='subtitle1' gutterBottom color={theme.palette.primary.main}>
            Tiện ích bạn đã chọn
          </Typography>
          {bookingData.selectedRooms.map((room, index) => (
            <Box key={index}>
              <RoomAmenitiesCard room={room} />
              {index !== bookingData.selectedRooms.length - 1 && <Divider sx={{ my: '20px' }} />}
            </Box>
          ))}
        </Box>
      </Box>
      <Divider />
      <Box sx={{ padding: '20px' }} display='flex' flexDirection='column' gap='20px'>
        <Box display='flex' justifyContent='space-between'>
          <Typography variant='subtitle2' color={theme.palette.grey[500]}>
            Tổng giá các phòng:
          </Typography>
          <Typography variant='subtitle2' fontWeight='bold'>
            {roomTotal.toLocaleString()} VND
          </Typography>
        </Box>
        <Box display='flex' justifyContent='space-between'>
          <Typography variant='subtitle2' color={theme.palette.grey[500]}>
            Tổng giá các tiện ích:
          </Typography>
          <Typography variant='subtitle2' fontWeight='bold'>
            {amenitiesTotal.toLocaleString()} VND
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ padding: '20px' }} display='flex' justifyContent='space-between'>
        <Typography variant='subtitle2' color={theme.palette.grey[500]}>
          Tổng đơn:
        </Typography>
        <Typography variant='subtitle2' fontWeight='bold'>
          {roomTotal.toLocaleString()} VND
        </Typography>
      </Box>
    </Box>
  )
}

export default BookingDetails
