import React, { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { tokens } from '~/themes/theme'
import { useGetAvailableAmenity } from '~/queries/useAmenity'
import { AmenityType } from '~/schemaValidations/amenity.schema'
import { useGetBookedRooms } from '~/queries/useRoom'
import { BookedRoomSchemaType } from '~/schemaValidations/room.schema'
import { formatStartEndTime } from '~/utils/utils'
import BookingAmenityDetails from '~/components/BookingDetails/BookingAmenityDetails'
import { LOCAL_STORAGE_KEY_ROOM, useBookingAmenityContext } from '~/contexts/BookingAmenityContext'
import { formatCurrencyAmenityPage } from '~/utils/currency'

interface CommonProps {
  onNext: () => void
  onBack: () => void
}

export const AmenityPage: React.FC<CommonProps> = (props) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  const [errorState, setErrorState] = useState<string | null>(null)
  const [selectedAmenityType, setSelectedAmenityType] = useState<string>('')
  const [quantity, setQuantity] = useState(0)
  const [detailAmenity, setDetailAmenity] = useState<AmenityType | null>(null)

  const { data: responseBookedRooms } = useGetBookedRooms()
  const bookedRooms: BookedRoomSchemaType[] = responseBookedRooms?.data.data ?? []

  const { bookedRoom, setBookedRoom, selectedAmenities, addAmenity } = useBookingAmenityContext()

  const [selectedRoomName, setSelectedRoomName] = useState<string>('')
  const [selectedBookingSlot, setSelectedBookingSlot] = useState<string>('')

  const [allAmenities, setAllAmenities] = useState<AmenityType[]>([])
  const { data: responseAllAmenities } = useGetAvailableAmenity(bookedRoom?.roomType.building.id || 1)

  useEffect(() => {
    if (responseAllAmenities?.data.data) {
      setAllAmenities(responseAllAmenities.data.data)
    }
  }, [responseAllAmenities])

  useEffect(() => {
    const savedRoom = localStorage.getItem(LOCAL_STORAGE_KEY_ROOM)
    if (!savedRoom) {
      setBookedRoom(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setDetailAmenity(null)
    setQuantity(0)
  }, [selectedAmenityType])

  const filteredAmenities = useMemo(() => {
    if (selectedAmenityType === '') {
      return allAmenities
    }
    return allAmenities.filter((amenity) => amenity.type === selectedAmenityType)
  }, [allAmenities, selectedAmenityType])

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
      setErrorState('Vui lòng chọn phòng và giờ đã đặt')
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

  const handleSelectRoomName = (event: SelectChangeEvent<string>) => {
    const roomName = event.target.value
    setSelectedRoomName(roomName)
    setSelectedBookingSlot('')
    setBookedRoom(null)
  }

  const handleSelectBookingSlot = (event: SelectChangeEvent<string>) => {
    const selectedSlot = event.target.value
    setSelectedBookingSlot(selectedSlot)
    const selectedRoom = bookedRooms.find(
      (room) => room.name === selectedRoomName && formatStartEndTime(room.startTime, room.endTime) === selectedSlot
    )
    setBookedRoom(selectedRoom || null)
  }

  const roomNames = [...new Set(bookedRooms.map((room) => room.name))]

  const bookingSlots = bookedRooms
    .filter((room) => room.name === selectedRoomName)
    .map((room) => formatStartEndTime(room.startTime, room.endTime))

  return (
    <Box
      sx={{
        marginX: { xs: '16px', sm: '32px', md: '64px', lg: '104px' },
        marginY: { xs: '16px', sm: '24px', md: '32px' }
      }}
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }} sx={{ padding: '0px !important' }}>
          <Box
            sx={{
              marginRight: { xs: '0', md: '12px' },
              background: '#FFF',
              paddingRight: { xs: '0', md: '12px' },
              marginBottom: { xs: '16px', md: '0' }
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '20px',
                alignItems: 'end',
                flexDirection: { xs: 'column', sm: 'row' }
              }}
            >
              <Typography
                variant='h5'
                sx={{ color: colors.primary[500], fontWeight: 700, marginBottom: { xs: '16px', sm: '0' } }}
              >
                Dịch vụ
              </Typography>
            </Box>
            <Box sx={{ padding: '0px 20px 20px 20px' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  justifyContent: 'space-between',
                  padding: '20px 0px 0px 0px',
                  gap: isMobile ? '12px' : '16px'
                }}
              >
                <FormControl fullWidth>
                  <InputLabel id='location-label'>Chọn Phòng đã đặt</InputLabel>
                  <Select
                    labelId='booked-room-label'
                    value={selectedRoomName}
                    label='Chọn Phòng đã đặt'
                    onChange={handleSelectRoomName}
                  >
                    {roomNames.map((roomName) => (
                      <MenuItem key={roomName} value={roomName}>
                        {roomName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {selectedRoomName && (
                  <FormControl fullWidth>
                    <InputLabel id='booking-slot-label'>Chọn khung giờ</InputLabel>
                    <Select
                      labelId='booking-slot-label'
                      value={selectedBookingSlot}
                      label='Chọn khung giờ đã đặt'
                      onChange={handleSelectBookingSlot}
                    >
                      {bookingSlots.map((slot) => (
                        <MenuItem key={slot} value={slot}>
                          {slot}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                <FormControl fullWidth>
                  <InputLabel id='amenities-label'>Chọn loại tiện ích</InputLabel>
                  <Select
                    labelId='amenities-label'
                    value={selectedAmenityType}
                    label='Chọn loại tiện ích'
                    onChange={handleAmenityTypeChange}
                  >
                    <MenuItem value=''>Tất cả</MenuItem>
                    <MenuItem value='Food'>Thức ăn</MenuItem>
                    <MenuItem value='Office'>Thiết bị</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ padding: '49px 0px 29px 0px' }}>
                <Typography variant='subtitle2' sx={{ fontWeight: 700, fontSize: '16px' }}>
                  Danh sách tiện ích
                </Typography>
                <Grid container spacing={isMobile ? 1 : 2} sx={{ padding: '10px 0' }}>
                  {filteredAmenities.length > 0 ? (
                    filteredAmenities.map((item) => (
                      <Grid size={{ xs: 12, sm: isTablet ? 4 : 6, md: 4 }} key={item.id}>
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
                  ) : (
                    <Grid size={12}>
                      <Typography variant='body1' sx={{ textAlign: 'center', color: colors.grey[500] }}>
                        Không có tiện ích cho chi nhánh này
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  justifyContent: 'space-between',
                  alignItems: isMobile ? 'stretch' : 'center',
                  gap: isMobile ? '16px' : '10px',
                  paddingBottom: '20px',
                  paddingTop: '20px'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    flexDirection: { xs: 'column', sm: 'row' }
                  }}
                >
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
                    sx={{
                      fontWeight: 700,
                      fontSize: '16px',
                      padding: '0px 20px 0px 0px',
                      color: colors.grey[200],
                      marginBottom: { xs: '10px', sm: '0' }
                    }}
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
                  {formatCurrencyAmenityPage(detailAmenity?.price ? detailAmenity.price * quantity : undefined)} VND
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
          <Grid size={{ xs: 12, md: 6 }} sx={{ paddingLeft: { xs: '0', md: '12px' } }}>
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
