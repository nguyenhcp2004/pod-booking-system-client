/* eslint-disable @typescript-eslint/no-unused-vars */

import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography, useTheme } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useContext, useEffect, useState } from 'react'
import { tokens } from '~/themes/theme'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import BookingDetails from '~/components/BookingDetails/BookingDetails'
import { useNavigate } from 'react-router-dom'
import { useGetAmenities } from '~/queries/useAmenity'
import { AmenityListRes } from '~/schemaValidations/amenity.schema'
import { BookingContext, BookingInfo } from '~/contexts/BookingContext'
interface CommonProps {
  onNext: () => void
  onBack: () => void
}

export const Amenities: React.FC<CommonProps> = (props) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const [roomType, setRoomType] = useState('')
  const [selectedAmenity, setSelectedAmenity] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(0)
  const { data: amenities = [], isLoading, error } = useGetAmenities()
  const bookingContext = useContext(BookingContext)
  const [detailAmenity, setDetailAmenity] = useState<string | null>(null)

  const handleAddAmentity = () => {
    if (!detailAmenity) {
      return
    }
    const newAmenity = {
      name: detailAmenity,
      quantity: quantity,
      price: 48000,
      id: 1
    }
    bookingContext?.setBookingData((prevData) => {
      const updatedRooms = prevData.selectedRooms.map((room) => {
        if (room.name === roomType) {
          if (room.amenities) {
            console.log('room.amenities', room.amenities)
            room.amenities.push(newAmenity)
            return room
          } else {
            console.log('room.amenities', room.amenities)
            room.amenities = [newAmenity]
            return room
          }
        }
        return room
      })
      return {
        ...prevData,
        selectedRooms: updatedRooms
      }
    })
  }

  if (!bookingContext) {
    throw new Error('BookingContext must be used within a BookingProvider')
  }
  const { bookingData }: { bookingData: BookingInfo } = bookingContext
  console.log(bookingData)

  const filteredAmenities = selectedAmenity ? amenities.filter((item) => item.type === selectedAmenity) : amenities

  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1)
  }

  const handleDecrement = () => {
    if (quantity > 0) {
      setQuantity((prevQuantity) => prevQuantity - 1)
    }
  }

  const navigate = useNavigate()
  const handleCancel = () => {
    navigate('/')
  }

  return (
    <Box sx={{ marginX: '104px' }}>
      <Grid container spacing={2}>
        <Grid size={{ lg: 6 }} sx={{ padding: '0px !important' }}>
          <Box sx={{ marginRight: '12px', background: '#FFF', paddingRight: '12px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
              <Typography variant='h5' sx={{ color: colors.primary[500], fontWeight: 700 }}>
                Tiện ích
              </Typography>
              <Typography variant='body1' sx={{ color: colors.grey[500], fontStyle: 'italic' }}>
                Bạn có thể thêm tiện ích sau khi đặt
              </Typography>
            </Box>
            <Box sx={{ padding: '0px 20px 20px 20px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '20px 20px 0px 0px', gap: '24px' }}>
                <FormControl fullWidth>
                  <InputLabel id='location-label'>Chọn Phòng</InputLabel>
                  <Select
                    labelId='room-type-label'
                    value={roomType}
                    label='Chọn Phòng'
                    onChange={(e) => setRoomType(e.target.value)}
                  >
                    {bookingData?.selectedRooms.map((room, index) => (
                      <MenuItem key={index} value={room.name}>
                        {room.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id='amenities-label'>Chọn loại tiện ích</InputLabel>
                  <Select
                    labelId='amenities-label'
                    value={selectedAmenity || ''}
                    label='Chọn loại tiện ích'
                    onChange={(e) => setSelectedAmenity(e.target.value)}
                  >
                    {Array.from(new Set(amenities.map((amenity) => amenity.type))).map((uniqueType, index) => (
                      <MenuItem key={index} value={uniqueType}>
                        {uniqueType}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ padding: '49px 0px 29px 0px' }}>
                <Typography variant='subtitle2' sx={{ fontWeight: 700, fontSize: '16px' }}>
                  Danh sách tiện ích
                </Typography>
                <Grid container spacing={4} sx={{ padding: '10px 20px' }}>
                  {filteredAmenities.map((item, index) => (
                    <Grid size={{ lg: 4, md: 6, xs: 12 }} key={index}>
                      <Button
                        variant='outlined'
                        fullWidth
                        sx={{
                          padding: '10px 0px',
                          minHeight: '50px',
                          borderRadius: '4px',
                          textAlign: 'center',
                          color: 'black',
                          borderColor: 'black',
                          fontSize: '14px'
                        }}
                        color={detailAmenity == item.name ? 'primary' : 'inherit'}
                        onClick={() => {
                          setDetailAmenity(item.name)
                        }}
                      >
                        {item.name}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '10px', padding: '0px 0px 20px 0px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', padding: '0px 20px' }}>
                  <Typography
                    variant='subtitle2'
                    sx={{ fontWeight: 700, fontSize: '16px', padding: '0px 20px 0px 0px', color: colors.grey[200] }}
                  >
                    Số lượng
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                      variant='outlined'
                      onClick={handleDecrement}
                      disabled={quantity === 0}
                      sx={{
                        minWidth: '35px',
                        minHeight: '40px',
                        borderRadius: '8px 0px 0px 8px',
                        '&:last-of-type': { borderTopRightRadius: '4px', borderBottomRightRadius: '4px' },
                        borderColor: colors.grey[200]
                      }}
                    >
                      <RemoveIcon sx={{ color: 'black' }} />
                    </Button>
                    <Typography
                      variant='body1'
                      sx={{
                        width: '80px',
                        textAlign: 'center',
                        border: '1px solid',
                        borderColor: colors.grey[200], // Adjust border color
                        padding: '9.2px 8px 8px 8px', // Padding to make it look like a button
                        borderLeft: 'none', // Remove left border for seamless connection
                        borderRight: 'none', // Remove right border for seamless connection
                        cursor: 'default' // Make it non-clickable
                      }}
                    >
                      {quantity}
                    </Typography>
                    <Button
                      variant='outlined'
                      onClick={handleIncrement}
                      sx={{
                        minWidth: '35px',
                        minHeight: '40px',
                        borderRadius: '0px 8px 8px 0px',
                        '&:first-of-type': { borderTopLeftRadius: '4px', borderBottomLeftRadius: '4px' },
                        borderColor: colors.grey[200]
                      }}
                    >
                      <AddIcon sx={{ color: 'black' }} />
                    </Button>
                  </Box>
                </Box>
                <Typography variant='subtitle2' sx={{ fontWeight: 700, fontSize: '20px', textAlign: 'center' }}>
                  48.000 VND
                </Typography>
              </Box>
              <Box sx={{ padding: '20px 0px 0px 0px' }}>
                <Button
                  variant='outlined'
                  fullWidth
                  sx={{
                    minHeight: '50px',
                    borderRadius: '96px',
                    border: '1px solid #A9A9B1', // Border color
                    boxShadow:
                      '0px 1px 3px 0px rgba(0, 0, 0, 0.12), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.20)',
                    color: colors.grey[500],
                    fontSize: '20px',
                    fontWeight: '500px',
                    textTransform: 'uppercase'
                  }}
                  onClick={() => handleAddAmentity()}
                >
                  Thêm tiện ích
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid size={{ lg: 6 }} sx={{ paddingLeft: '12px', background: '#FFF' }}>
          <Box>
            <BookingDetails />
          </Box>
          <Grid sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, padding: '20px' }}>
            <Grid size={{ lg: 9 }}>
              <Button
                onClick={props.onNext}
                fullWidth
                sx={{ background: colors.primary[500], color: '#FFF', borderRadius: 'var(--12, 96px)' }}
              >
                Hoàn tất
              </Button>
            </Grid>
            <Grid size={{ lg: 4 }}>
              <Button
                variant='text'
                onClick={handleCancel}
                fullWidth
                sx={{ background: '#FFF', color: colors.primary[500] }}
              >
                Bỏ qua
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}
