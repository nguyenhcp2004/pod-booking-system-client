import { Box, Typography, Divider, useTheme, Avatar } from '@mui/material'
import { useBookingContext } from '~/contexts/BookingContext'
import RoomAmenitiesCard from './RoomAmenitiesCard'
import { calTotalPrice } from '~/utils/order'

const BookingDetails = () => {
  const bookingContext = useBookingContext()
  const bookingData = bookingContext!.bookingData
  const setBookingData = bookingContext?.setBookingData
  const theme = useTheme()

  if (!bookingData) return null

  const roomHaveAmenities = bookingData.selectedRooms.filter((room) => room.amenities.length > 0).length
  const removeAmenity = (amenity: string) => {
    setBookingData?.((prev) => {
      if (!prev) return prev
      const newSelectedRooms = prev.selectedRooms.map((room) => {
        const newAmenities = room.amenities.filter((item) => item.name !== amenity)
        return { ...room, amenities: newAmenities }
      })
      return { ...prev, selectedRooms: newSelectedRooms }
    })
  }
  return (
    <Box sx={{ bgcolor: 'white' }}>
      <Box sx={{ padding: '20px' }}>
        <Typography variant='h5' color={theme.palette.primary.main} gutterBottom fontWeight='bold'>
          Đơn đặt
        </Typography>
        <Box display='flex' alignItems='center' sx={{ marginTop: '24px' }} gap='20px'>
          <Avatar
            src={bookingData?.selectedRooms[0]?.image || ''}
            alt={bookingData?.roomType?.name || ''}
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
              {bookingData?.roomType?.name || 'Chưa chọn loại phòng'}
            </Typography>
            <Box display='flex' sx={{ marginTop: '4px' }}>
              <Typography variant='subtitle2' color={theme.palette.primary.main}>
                {bookingData.roomType?.price.toLocaleString()} VND
              </Typography>
              <Typography variant='subtitle2'>/tiếng</Typography>
            </Box>
            <Box sx={{ marginTop: '12px' }} flexDirection='column' display='flex' gap='12px'>
              <Box display='flex' gap='3px'>
                <Typography variant='body2' fontWeight='bold'>
                  Địa chỉ:
                </Typography>
                <Typography variant='body2'>
                  {' '}
                  {bookingData.roomType?.building?.address
                    ? bookingData?.roomType?.building?.address
                    : bookingData?.roomType?.building?.address}
                </Typography>
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
                <Typography variant='body2'>{bookingData.timeSlots.join(', ')}</Typography>
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
                <Typography variant='body2'>
                  {bookingData.servicePackage?.name} ({calTotalPrice(bookingData).packageRepeat} ngày)
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box sx={{ marginTop: '24px', paddingY: '20px' }}>
          {roomHaveAmenities > 0 && (
            <Typography variant='subtitle1' gutterBottom color={theme.palette.primary.main} fontWeight='bold'>
              Dịch vụ bạn đã chọn
            </Typography>
          )}
          {bookingData.selectedRooms.map((room, index) => {
            if (room.amenities.length === 0) return null
            return (
              <Box key={index}>
                <RoomAmenitiesCard room={room} removeAmenity={removeAmenity} />
                {index !== roomHaveAmenities - 1 && <Divider sx={{ my: '20px' }} />}
              </Box>
            )
          })}
        </Box>
      </Box>
      <Divider />
      <Box sx={{ padding: '20px' }} display='flex' flexDirection='column' gap='20px'>
        <Box display='flex' justifyContent='space-between'>
          <Typography variant='subtitle2' color={theme.palette.grey[500]}>
            Tổng giá các phòng:
          </Typography>
          <Typography variant='subtitle2' fontWeight='bold'>
            {calTotalPrice(bookingData).totalRoomPrice.toLocaleString()} VND
          </Typography>
        </Box>
        <Box display='flex' justifyContent='space-between'>
          <Typography variant='subtitle2' color={theme.palette.grey[500]}>
            Tổng giá các dịch vụ:
          </Typography>
          <Typography variant='subtitle2' fontWeight='bold'>
            {calTotalPrice(bookingData).totalAmenitiesPrice.toLocaleString()} VND
          </Typography>
        </Box>
        <Box display='flex' justifyContent='space-between'>
          <Typography variant='subtitle2' color={theme.palette.grey[500]}>
            Giảm giá: ({bookingData.servicePackage?.name} {bookingData.servicePackage?.discountPercentage}%)
          </Typography>
          <Typography variant='subtitle2' fontWeight='bold'>
            {calTotalPrice(bookingData).discount.toLocaleString()} VND
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ padding: '20px' }} display='flex' justifyContent='space-between'>
        <Typography variant='subtitle2' color={theme.palette.grey[500]}>
          Tổng đơn:
        </Typography>
        <Typography variant='subtitle2' fontWeight='bold'>
          {calTotalPrice(bookingData).total.toLocaleString()} VND
        </Typography>
      </Box>
    </Box>
  )
}

export default BookingDetails
