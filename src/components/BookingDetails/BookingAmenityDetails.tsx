import { Avatar, Box, Divider, Typography, useTheme } from '@mui/material'
import { AmenityType } from '~/schemaValidations/amenity.schema'
import { BookedRoomSchemaType } from '~/schemaValidations/room.schema'
import AmenityCard from './AmenityCard'
import { useState } from 'react'

interface BookingAmenityDetailsProps {
  bookedRoom: BookedRoomSchemaType
  selectedAmenities: AmenityType[]
}

export default function BookingAmenityDetails({
  bookedRoom,
  selectedAmenities: initialSelectedAmenities
}: BookingAmenityDetailsProps) {
  const theme = useTheme()
  const [selectedAmenities, setSelectedAmenities] = useState<AmenityType[]>(initialSelectedAmenities)
  console.log(initialSelectedAmenities.length)

  const removeAmenity = (amenityName: string) => {
    setSelectedAmenities((prevAmenties) => prevAmenties.filter((amenity) => amenity.name !== amenityName))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })
  }

  const calculateHours = (startTime: string, endTime: string) => {
    const start = new Date(startTime)
    const end = new Date(endTime)
    const diffInMs = end.getTime() - start.getTime()
    return Math.ceil(diffInMs / (1000 * 60 * 60)) // Round up to the nearest hour
  }
  const hours = calculateHours(bookedRoom.startTime, bookedRoom.endTime)
  const roomTotal = bookedRoom.roomType.price * hours
  const amenitiesTotal = selectedAmenities.reduce((total, amenity) => total + amenity.price * amenity.quantity, 0)
  const discount = bookedRoom.servicePackage.discountPercentage
    ? (amenitiesTotal * bookedRoom.servicePackage.discountPercentage) / 100
    : 0
  const total = amenitiesTotal - discount

  return (
    <Box sx={{ bgcolor: 'white' }}>
      <Box sx={{ padding: '20px' }}>
        <Typography variant='h5' color={theme.palette.primary.main} gutterBottom fontWeight='bold'>
          Đơn đặt
        </Typography>
        <Box display='flex' alignItems='center' sx={{ marginTop: '24px' }} gap='20px'>
          <Avatar
            src={bookedRoom.image || ''}
            alt={bookedRoom.name || ''}
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
              {bookedRoom.roomType.name || 'Chưa chọn loại phòng'}
            </Typography>
            <Box display='flex' sx={{ marginTop: '4px' }}>
              <Typography variant='subtitle2' color={theme.palette.primary.main}>
                {bookedRoom.roomType.price.toLocaleString()} VND
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
                  {bookedRoom.roomType.building.address
                    ? bookedRoom.roomType.building.address
                    : bookedRoom.roomType.building.address}
                </Typography>
              </Box>
              <Box display='flex' gap='3px'>
                <Typography variant='body2' fontWeight='bold'>
                  Ngày:
                </Typography>
                <Typography variant='body2'>{formatDate(bookedRoom.startTime)}</Typography>
              </Box>
              <Box display='flex' gap='3px'>
                <Typography variant='body2' fontWeight='bold'>
                  Slot:
                </Typography>
                <Typography variant='body2'>
                  {formatTime(bookedRoom.startTime)} - {formatTime(bookedRoom.endTime)}
                </Typography>
              </Box>
              <Box display='flex' gap='3px'>
                <Typography variant='body2' fontWeight='bold'>
                  Phòng:
                </Typography>
                <Typography variant='body2'>{bookedRoom.name}</Typography>
              </Box>
              <Box display='flex' gap='3px'>
                <Typography variant='body2' fontWeight='bold'>
                  Gói:
                </Typography>
                <Typography variant='body2'>{bookedRoom.servicePackage.name}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box sx={{ marginTop: '24px', paddingY: '20px' }}>
          {initialSelectedAmenities.length > 0 && (
            <Typography variant='subtitle1' gutterBottom color={theme.palette.primary.main}>
              Tiện ích bạn đã chọn
            </Typography>
          )}
          {initialSelectedAmenities.map((amenity, index) => (
            <Box key={amenity.id}>
              <AmenityCard bookedRoom={bookedRoom} selectedAmenities={[amenity]} removeAmenity={removeAmenity} />
              {index !== selectedAmenities.length - 1 && <Divider sx={{ my: '20px' }} />}
            </Box>
          ))}
        </Box>
      </Box>
      <Divider />
      <Box sx={{ padding: '20px' }} display='flex' flexDirection='column' gap='20px'>
        <Box display='flex' justifyContent='space-between'>
          <Typography variant='subtitle2' color={theme.palette.grey[500]}>
            Tổng giá phòng:
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
        <Box display='flex' justifyContent='space-between'>
          <Typography variant='subtitle2' color={theme.palette.grey[500]}>
            Điscount:
          </Typography>
          <Typography variant='subtitle2' fontWeight='bold'>
            {discount.toLocaleString()} VND
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ padding: '20px' }} display='flex' justifyContent='space-between'>
        <Typography variant='subtitle2' color={theme.palette.grey[500]}>
          Tổng đơn:
        </Typography>
        <Typography variant='subtitle2' fontWeight='bold'>
          {total.toLocaleString()} VND
        </Typography>
      </Box>
    </Box>
  )
}
