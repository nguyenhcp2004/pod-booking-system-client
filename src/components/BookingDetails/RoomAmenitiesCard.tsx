import { Box, Typography, useTheme } from '@mui/material'
import React from 'react'
import { RoomContextType } from '~/contexts/BookingContext'
import ClearIcon from '@mui/icons-material/Clear'

const RoomAmenitiesCard: React.FC<{ room: RoomContextType; removeAmenity: (amenity: string) => void }> = ({
  room,
  removeAmenity
}) => {
  const theme = useTheme()

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant='subtitle2'>{room.name}</Typography>
      <Box>
        {room?.amenities?.map((amenity) => (
          <Box
            key={amenity.id}
            display='flex'
            justifyContent='space-between'
            alignItems='center'
            sx={{ marginTop: '20px' }}
          >
            <Typography variant='subtitle2' color={theme.palette.grey[500]} sx={{ flex: 1 }}>
              {amenity.name}
            </Typography>
            <Typography variant='subtitle2' color={theme.palette.grey[500]} sx={{ flex: 1 }} textAlign='center'>
              {amenity.quantity}
            </Typography>
            <Box sx={{ flex: 1 }} display='flex' justifyContent='flex-end' gap='5px'>
              <Typography variant='subtitle2' fontWeight='bold'>
                {amenity.price.toLocaleString()} VND
              </Typography>

              <ClearIcon
                onClick={() => removeAmenity(amenity.name)}
                sx={{
                  marginTop: '-2px',
                  color: theme.palette.grey[300],
                  cursor: 'pointer',
                  '&:hover': {
                    color: theme.palette.error.main
                  }
                }}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default RoomAmenitiesCard
