import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography, useTheme } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useContext, useEffect, useMemo, useState } from 'react'
import { tokens } from '~/themes/theme'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import BookingDetails from '~/components/BookingDetails/BookingDetails'
import { useGetAvailableAmenity } from '~/queries/useAmenity'
import { AmenityType } from '~/schemaValidations/amenity.schema'
import { Amenity, BookingContext } from '~/contexts/BookingContext'
import { toast } from 'react-toastify'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import { Helmet } from 'react-helmet-async'
import { calTotalPrice } from '~/utils/order'

interface CommonProps {
  onNext: () => void
  onBack: () => void
}

const amenityTranslations: Record<string, string> = {
  Food: 'Thức ăn',
  Office: 'Thiết bị'
}

export const Amenities: React.FC<CommonProps> = (props) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const [selectedAmenity, setSelectedAmenity] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(0)
  const [errorState, setErrorState] = useState<string | null>(null)
  const bookingContext = useContext(BookingContext)
  if (!bookingContext) {
    throw new Error('BookingContext must be used within a BookingProvider')
  }
  const { bookingData, setBookingData } = bookingContext
  const [detailAmenity, setDetailAmenity] = useState<AmenityType | null>(null)
  const [roomType, setRoomType] = useState(bookingData?.selectedRooms[0].name)

  const { data: amenitiesData } = useGetAvailableAmenity(bookingData?.roomType?.building.id || 1)

  const amenities = useMemo(() => amenitiesData?.data.data || [], [amenitiesData])

  const filteredAmenities = useMemo(
    () => (selectedAmenity ? amenities.filter((item) => item.type === selectedAmenity) : amenities),
    [selectedAmenity, amenities]
  )

  const socketCL = new SockJS('http://localhost:8080/ws')
  const client = Stomp.over(socketCL)

  useEffect(() => {
    client.connect({}, () => {
      client.subscribe('/topic/payments', (data) => {
        const roomId = JSON.parse(data.body)
        if (bookingData.selectedRooms.some((room) => room.id == roomId.id)) {
          toast.success(`Phòng ${roomId.name} vừa được đặt`)
        }
      })
    })

    return () => {
      if (client.connected) {
        client.disconnect(() => {})
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingData])

  const handleAddAmentity = () => {
    if (!detailAmenity) return
    if (quantity === 0) {
      setErrorState('Vui lòng chọn số lượng')
      return
    }
    const newAmenity: Amenity = {
      id: detailAmenity?.id,
      name: detailAmenity?.name,
      price: detailAmenity?.price,
      quantity: quantity
    }
    setBookingData((prev) => ({
      ...prev,
      selectedRooms: prev.selectedRooms.map((room) => {
        if (room.name === roomType) {
          if (room.amenities.find((item) => item.name === newAmenity.name)) {
            return {
              ...room,
              amenities: room.amenities.map((item) => {
                if (item.name === newAmenity.name) {
                  return {
                    ...item,
                    quantity: item.quantity + newAmenity.quantity
                  }
                }
                return item
              })
            }
          } else {
            return {
              ...room,
              amenities: [...room.amenities, newAmenity]
            }
          }
        }
        return room
      })
    }))
    setErrorState(null)
    setQuantity(0)
    setDetailAmenity(null)
  }

  const handleIncrement = () => {
    if (!detailAmenity) {
      setErrorState('Vui lòng chọn dịch vụ')
      return
    } else {
      const newQuantityApplyPackage = (quantity + 1) * calTotalPrice(bookingData).packageRepeat
      const room = bookingData.selectedRooms.filter((room) => room.name === roomType)[0]
      const preAmennity = room.amenities.filter((item) => item.name === detailAmenity.name)
      if (preAmennity.length > 0) {
        if (
          detailAmenity.quantity <
          newQuantityApplyPackage + preAmennity[0].quantity * calTotalPrice(bookingData).packageRepeat
        ) {
          setErrorState('Số lượng dịch vụ không đủ')
          return
        }
        if (detailAmenity.type === 'Office') {
          if (
            (preAmennity[0].quantity * calTotalPrice(bookingData).packageRepeat + newQuantityApplyPackage) /
              calTotalPrice(bookingData).packageRepeat >=
            3
          ) {
            setErrorState('Mỗi phòng chỉ được chọn tối đa 2 dịch vụ này')
            return
          }
          setErrorState(null)
          setQuantity((prevQuantity) => prevQuantity + 1)
          return
        }
      } else {
        if (detailAmenity.quantity < newQuantityApplyPackage) {
          setErrorState('Số lượng dịch vụ không đủ')
          return
        }
        if (detailAmenity.type === 'Office') {
          if (newQuantityApplyPackage / calTotalPrice(bookingData).packageRepeat >= 3) {
            setErrorState('Mỗi phòng chỉ được chọn tối đa 2 dịch vụ này')
            return
          }
        }
      }
      setErrorState(null)
      setQuantity((prevQuantity) => prevQuantity + 1)
    }
  }

  const handleDecrement = () => {
    if (quantity > 0) {
      setErrorState(null)
      setQuantity((prevQuantity) => prevQuantity - 1)
    }
  }

  const handleSelectAmenity = (item: AmenityType) => {
    setErrorState(null)
    setQuantity(0)
    if (detailAmenity?.name == item.name) {
      setDetailAmenity(null)
      return
    }
    setDetailAmenity(item)
  }

  const roomHaveAmenities = bookingData.selectedRooms.filter((room) => room.amenities.length > 0).length

  return (
    <Box sx={{ marginX: '104px' }}>
      <Helmet>
        <title>Đặt dịch vụ | POD System</title>
        <meta
          name='description'
          content='Đặt thêm dịch vụ: Nâng cao trải nghiệm phòng với đồ ăn, bàn ghế và hơn thế nữa'
        />
      </Helmet>
      <Grid container spacing={2}>
        <Grid size={{ lg: 6 }} sx={{ padding: '0px !important' }}>
          <Box sx={{ marginRight: '12px', background: '#FFF', paddingRight: '12px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '20px', alignItems: 'end' }}>
              <Typography variant='h5' sx={{ color: colors.primary[500], fontWeight: 700 }}>
                Dịch vụ
              </Typography>
              <Typography variant='body1' sx={{ color: colors.grey[500], fontStyle: 'italic', fontSize: '12px' }}>
                Bạn vẫn có thể thêm các dịch vụ sau khi đặt
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
                  <InputLabel id='amenities-label'>Chọn loại dịch vụ</InputLabel>
                  <Select
                    labelId='amenities-label'
                    value={selectedAmenity || ''}
                    label='Chọn loại dịch vụ'
                    onChange={(e) => {
                      setSelectedAmenity(e.target.value)
                    }}
                  >
                    {Array.from(new Set(amenities.map((amenity) => amenity.type))).map((uniqueType, index) => (
                      <MenuItem key={index} value={uniqueType}>
                        {amenityTranslations[uniqueType] || uniqueType}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ padding: '49px 0px 29px 0px' }}>
                <Typography variant='subtitle2' sx={{ fontWeight: 700, fontSize: '16px' }}>
                  Danh sách dịch vụ
                </Typography>
                <Grid container spacing={4} sx={{ padding: '10px 0' }}>
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
                          fontSize: '14px',
                          backgroundColor: detailAmenity?.name == item.name ? colors.grey[100] : 'transparent'
                        }}
                        onClick={() => {
                          handleSelectAmenity(item)
                        }}
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
                  Thêm dịch vụ
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid size={{ lg: 6 }} sx={{ paddingLeft: '12px' }}>
          <Box sx={{ background: '#FFF' }}>
            <Box>
              <BookingDetails />
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
              >
                {roomHaveAmenities ? 'Hoàn tất' : 'Bỏ qua'}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
