import { Box, Typography, useTheme } from '@mui/material'
import { useLocation } from 'react-router-dom'
import { AmenityType } from '~/schemaValidations/amenity.schema'
import ClearIcon from '@mui/icons-material/Clear'
import { useBookingAmenityContext } from '~/contexts/BookingAmenityContext'

interface AmenityCardProps {
  amenity: AmenityType
}

export default function AmenityCard({ amenity }: AmenityCardProps) {
  const theme = useTheme()
  const location = useLocation()
  const { bookedRoom, removeAmenity } = useBookingAmenityContext()

  if (!bookedRoom) return null

  return (
    <Box sx={{ width: '100%' }}>
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
            {amenity.price} VND
          </Typography>
          {location.pathname == '/order-amenity-detail/1' && (
            <ClearIcon
              onClick={() => removeAmenity(amenity.id)}
              sx={{
                marginTop: '-2px',
                color: theme.palette.grey[300],
                cursor: 'pointer',
                '&:hover': {
                  color: theme.palette.error.main
                }
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  )
}
