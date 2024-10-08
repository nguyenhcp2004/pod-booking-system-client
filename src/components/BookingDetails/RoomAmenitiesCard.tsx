import { Box, Typography, useTheme } from '@mui/material'
import React from 'react'
import { Room2 } from '~/contexts/BookingContext'

const RoomAmenitiesCard: React.FC<{ room: Room2 }> = ({ room }) => {
  const theme = useTheme()
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant='subtitle2'>{room.name}</Typography>
      <Box>
        {room?.amenities?.map((amenity) => (
          <Box key={amenity.id} display='flex' justifyContent='space-between' sx={{ marginTop: '20px' }}>
            <Typography variant='subtitle2' color={theme.palette.grey[500]} sx={{ flex: 1 }}>
              {amenity.name}
            </Typography>
            <Typography variant='subtitle2' color={theme.palette.grey[500]} sx={{ flex: 1 }} textAlign='center'>
              {amenity.quantity}
            </Typography>
            <Typography variant='subtitle2' fontWeight='bold' sx={{ flex: 1 }} textAlign='end'>
              {amenity.price} VND
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default RoomAmenitiesCard
