import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography, useTheme } from '@mui/material'
import React, { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { useGetAmenities } from '~/queries/useAmenity'
import { tokens } from '~/themes/theme'
import Grid from '@mui/material/Grid2'
import { AmenityType } from '~/schemaValidations/amenity.schema'
import { Amenity, BookingInfo, RoomContextType } from '~/contexts/BookingContext'
import { Add, Remove } from '@mui/icons-material'

interface AddAmenityOrderProps {
  bookingData: BookingInfo
  setBookingData: Dispatch<SetStateAction<BookingInfo>>
}
const AddAmenity: React.FC<AddAmenityOrderProps> = ({ bookingData, setBookingData }) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const [room, setRoom] = useState<string | null>(null)
  const [selectedAmenity, setSelectedAmenity] = useState<string | null>(null)
  const [detailAmenity, setDetailAmenity] = useState<AmenityType | null>(null)
  const [errorState, setErrorState] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(0)

  const { data: amenities = [] } = useGetAmenities()
  const filteredAmenities = useMemo(() => {
    return selectedAmenity ? amenities.filter((item) => item.type === selectedAmenity) : amenities
  }, [selectedAmenity, amenities])

  const handleIncrement = () => {
    if (!room) {
      setErrorState('Vui lòng chọn phòng')
      return
    }
    if (!detailAmenity) {
      setErrorState('Vui lòng chọn tiện ích')
      return
    } else {
      if (detailAmenity.quantity < quantity + 1) {
        setErrorState('Số lượng tiện ích không đủ')
        return
      }
      if (detailAmenity.type === 'Office') {
        const r1 = bookingData.selectedRooms.filter((r1: RoomContextType) => r1.name === room)[0]
        const preAmennity = r1?.amenities.filter((item: Amenity) => item.name === detailAmenity.name)
        if (preAmennity?.length > 0) {
          if (preAmennity[0].quantity + quantity >= 2) {
            setErrorState('Bạn chỉ được chọn tối đa 2 dịch vụ này')
            return
          }
          setErrorState(null)
          setQuantity((prevQuantity) => prevQuantity + 1)
          return
        }
        if (quantity >= 2) {
          setErrorState('Bạn chỉ được chọn tối đa 2 dịch vụ này')
          return
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
      selectedRooms: prev.selectedRooms.map((r) => {
        if (r.name === room) {
          if (r.amenities.find((item) => item.name === newAmenity.name)) {
            return {
              ...r,
              amenities: r.amenities.map((item) => {
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
              ...r,
              amenities: [...r.amenities, newAmenity]
            }
          }
        }
        return r
      })
    }))
    setErrorState(null)
    setQuantity(0)
    setDetailAmenity(null)
  }

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        padding: 3,
        borderRadius: 2,
        width: '100%'
      }}
    >
      <Box>
        <Grid container spacing={2}>
          <Grid size={6}>
            <FormControl fullWidth>
              <InputLabel size='small'>Chọn khách hàng</InputLabel>
              <Select size='small' label='Chọn khách hàng'>
                <MenuItem value=''>Khách hàng 1</MenuItem>
                <MenuItem value=''>Khách hàng 2</MenuItem>
                <MenuItem value=''>Khách hàng 3</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={6}>
            <FormControl fullWidth>
              <InputLabel size='small'>Chọn Phòng</InputLabel>
              <Select
                size='small'
                label='Chọn Phòng'
                value={room}
                onChange={(e) => {
                  setRoom(e.target.value as string)
                }}
              >
                <MenuItem value=''>Phòng 1</MenuItem>
                <MenuItem value=''>Phòng 2</MenuItem>
                <MenuItem value=''>Phòng 3</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={6}>
            <FormControl fullWidth>
              <InputLabel size='small'>Chọn loại tiện ích</InputLabel>
              <Select
                size='small'
                value={selectedAmenity || ''}
                label='Chọn loại tiện ích'
                onChange={(e) => {
                  setSelectedAmenity(e.target.value)
                }}
              >
                {Array.from(new Set(amenities.map((amenity) => amenity.type))).map((uniqueType, index) => (
                  <MenuItem key={index} value={uniqueType}>
                    {uniqueType}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ paddingY: '20px' }}>
          <Typography variant='subtitle2' sx={{ fontWeight: 700, fontSize: '16px' }}>
            Danh sách tiện ích
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
                <Remove sx={{ color: 'black' }} />
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
                <Add sx={{ color: 'black' }} />
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
            onClick={() => {
              handleAddAmentity()
            }}
          >
            Thêm tiện ích
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default AddAmenity
