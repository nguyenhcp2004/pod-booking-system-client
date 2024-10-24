import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useTheme
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useEffect, useState } from 'react'
import { tokens } from '~/themes/theme'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { useGetAmenities, useGetAmenitiesByType } from '~/queries/useAmenity'
import { AmenityType } from '~/schemaValidations/amenity.schema'
import { useGetBookedRooms } from '~/queries/useRoom'
import { BookedRoomSchemaType } from '~/schemaValidations/room.schema'
import { formatStartEndTime } from '~/utils/utils'
import BookingAmenityDetails from '~/components/BookingDetails/BookingAmenityDetails'
import { useBookingAmenityContext } from '~/contexts/BookingAmenityContext'

interface CommonProps {
  onNext: () => void
  onBack: () => void
}

export const AmenityPage: React.FC<CommonProps> = (props) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const [errorState, setErrorState] = useState<string | null>(null)
  const [selectedAmenityType, setSelectedAmenityType] = useState<string>('')
  const [quantity, setQuantity] = useState(0)
  const [detailAmenity, setDetailAmenity] = useState<AmenityType | null>(null)
  const { data: response, refetch } = useGetAmenitiesByType(selectedAmenityType)
  const { data: responseAllAmenities } = useGetAmenities()
  const { data: responseBookedRooms } = useGetBookedRooms()
  const amenities: AmenityType[] = response?.data.data ?? []
  const allAmenities: AmenityType[] = responseAllAmenities ?? []
  const bookedRooms: BookedRoomSchemaType[] = responseBookedRooms?.data.data ?? []

  const { bookedRoom, setBookedRoom, selectedAmenities, addAmenity } = useBookingAmenityContext()

  useEffect(() => {
    if (selectedAmenityType) {
      refetch()
    }
    setDetailAmenity(null)
    setQuantity(0)
  }, [selectedAmenityType, refetch])

  const handleAddAmentity = () => {
    if (!detailAmenity) {
      setErrorState('Vui lòng chọn tiện ích')
      return
    }
    if (quantity === 0) {
      setErrorState('Vui lòng chọn số lượng')
      return
    }
    if (!bookedRoom) {
      setErrorState('Vui lòng chọn phòng đã đặt')
      return
    }

    const newAmenity = {
      ...detailAmenity,
      quantity: quantity
    }

    addAmenity(newAmenity)
    setQuantity(0)
    setDetailAmenity(null)
  }

  const handleDecrement = () => {
    if (quantity > 0) {
      // setErrorState(null)
      setQuantity((prevQuantity) => prevQuantity - 1)
    }
  }
  const handleIncrement = () => {
    if (!detailAmenity) {
      setErrorState('Vui lòng chọn tiện ích')
      return
    } else {
      if (detailAmenity.quantity < quantity) {
        setErrorState('Số lượng tiện ích không đủ')
        return
      }
      setErrorState(null)
      setQuantity((prevQuantity) => prevQuantity + 1)
    }
  }

  const handleSelectAmenity = (item: AmenityType) => {
    setQuantity(0)
    if (detailAmenity?.name === item.name) {
      setDetailAmenity(null)
      return
    }
    setDetailAmenity(item)
  }

  const handleAmenityTypeChange = (event: SelectChangeEvent<string>) => {
    setSelectedAmenityType(event.target.value)
  }

  const handleSelectBookedRoom = (event: SelectChangeEvent<string>) => {
    const selectedRoom = bookedRooms.find((room) => room.startTime === event.target.value)
    setBookedRoom(selectedRoom || null)
  }

  // const roomHaveAmenities = bookingData.selectedRooms.filter((room) => room.amenities.length > 0).length

  return (
    <Box sx={{ marginX: '104px' }}>
      <Grid container spacing={2}>
        <Grid size={{ lg: 6 }} sx={{ padding: '0px !important' }}>
          <Box sx={{ marginRight: '12px', background: '#FFF', paddingRight: '12px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '20px', alignItems: 'end' }}>
              <Typography variant='h5' sx={{ color: colors.primary[500], fontWeight: 700 }}>
                Dịch vụ
              </Typography>
            </Box>
            <Box sx={{ padding: '0px 20px 20px 20px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '20px 20px 0px 0px', gap: '24px' }}>
                <FormControl fullWidth>
                  <InputLabel id='location-label'>Chọn Phòng đã đặt</InputLabel>
                  <Select
                    labelId='booked-room-label'
                    value={bookedRoom?.startTime || ''}
                    label='Chọn Phòng đã đặt'
                    onChange={handleSelectBookedRoom}
                  >
                    {bookedRooms.map((room) => (
                      <MenuItem key={room.id} value={room.startTime}>
                        {room.name} - {formatStartEndTime(room.startTime, room.endTime)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id='amenities-label'>Chọn loại tiện ích</InputLabel>
                  <Select
                    labelId='amenities-label'
                    value={selectedAmenityType}
                    label='Chọn loại tiện ích'
                    onChange={handleAmenityTypeChange}
                  >
                    <MenuItem value='Food'>Food</MenuItem>
                    <MenuItem value='Office'>Office</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ padding: '49px 0px 29px 0px' }}>
                <Typography variant='subtitle2' sx={{ fontWeight: 700, fontSize: '16px' }}>
                  Danh sách tiện ích
                </Typography>
                <Grid container spacing={4} sx={{ padding: '10px 0' }}>
                  {selectedAmenityType !== ''
                    ? amenities.map((item) => (
                        <Grid size={{ lg: 4, md: 6, xs: 12 }} key={item.id}>
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
                              fontSize: '14px',
                              backgroundColor: detailAmenity?.id === item.id ? colors.grey[100] : 'transparent'
                            }}
                            onClick={() => handleSelectAmenity(item)}
                          >
                            {item.name}
                          </Button>
                        </Grid>
                      ))
                    : allAmenities.map((item) => (
                        <Grid size={{ lg: 4, md: 6, xs: 12 }} key={item.id}>
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
                              fontSize: '14px',
                              backgroundColor: detailAmenity?.id === item.id ? colors.grey[100] : 'transparent'
                            }}
                            onClick={() => handleSelectAmenity(item)}
                          >
                            {item.name}
                          </Button>
                        </Grid>
                      ))}
                </Grid>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '10px',
                  paddingBottom: '20px',
                  paddingTop: '20px'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                  {errorState && (
                    <Typography
                      variant='subtitle2'
                      sx={{ color: 'red', paddingBottom: '10px', position: 'absolute', bottom: '40px' }}
                    >
                      {errorState}
                    </Typography>
                  )}
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
                        height: '40px',
                        borderRadius: '8px 0px 0px 8px',
                        '&:last-of-type': { borderTopRightRadius: '4px', borderBottomRightRadius: '4px' },
                        borderColor: colors.grey[200]
                      }}
                    >
                      <RemoveIcon sx={{ color: 'black' }} />
                    </Button>
                    <Typography
                      variant='body1'
                      aria-readonly='true'
                      sx={{
                        width: '80px',
                        textAlign: 'center',
                        height: '40px',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: colors.grey[200],
                        padding: '9.2px 8px 8px 8px',
                        borderLeft: 'none',
                        borderRight: 'none',
                        cursor: 'default'
                      }}
                    >
                      {quantity}
                    </Typography>
                    <Button
                      variant='outlined'
                      onClick={handleIncrement}
                      sx={{
                        minWidth: '35px',
                        height: '40px',
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
                  {detailAmenity?.price ? detailAmenity.price * quantity : 0} VND
                </Typography>
              </Box>
              <Box sx={{ padding: '20px 0px 10px 0px' }}>
                <Button
                  variant='outlined'
                  fullWidth
                  sx={{
                    minHeight: '40px',
                    borderRadius: '96px',
                    border: '1px solid #A9A9B1',
                    boxShadow:
                      '0px 1px 3px 0px rgba(0, 0, 0, 0.12), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.20)',
                    color: colors.grey[500],
                    fontSize: '15px',
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

        {bookedRoom && (
          <Grid size={{ lg: 6 }} sx={{ paddingLeft: '12px' }}>
            <Box sx={{ background: '#FFF' }}>
              <Box>
                <BookingAmenityDetails />
              </Box>
              <Box sx={{ width: '100%', padding: '20px' }}>
                <Button
                  onClick={props.onNext}
                  fullWidth
                  sx={{
                    background: colors.primary[500],
                    color: '#FFF',
                    borderRadius: 'var(--12, 96px)'
                  }}
                  disabled={selectedAmenities.length === 0}
                >
                  {selectedAmenities.length > 0 ? 'Hoàn tất' : 'Vui lòng chọn tiện ích'}
                </Button>
              </Box>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}
