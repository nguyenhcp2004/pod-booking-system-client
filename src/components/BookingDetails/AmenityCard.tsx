import { Box, Typography, useTheme } from '@mui/material'
// import { useLocation } from 'react-router-dom'
import { AmenityType } from '~/schemaValidations/amenity.schema'
import ClearIcon from '@mui/icons-material/Clear'
import { BookedRoomSchemaType } from '~/schemaValidations/room.schema'

interface AmenityCardProps {
  bookedRoom: BookedRoomSchemaType
  selectedAmenities: AmenityType[]
  removeAmenity: (amenityName: string) => void
}

export default function AmenityCard({ bookedRoom, selectedAmenities, removeAmenity }: AmenityCardProps) {
  const theme = useTheme()
//   const location = useLocation()
  console.log(selectedAmenities)

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant='subtitle2'>{bookedRoom.name}</Typography>
      <Box>
        {selectedAmenities.map((amenity) => (
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
              {/* {location.pathname == '/order-detail/1' && ( */}
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
              {/* )} */}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
