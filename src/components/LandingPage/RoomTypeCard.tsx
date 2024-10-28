import React from 'react'
import { Card, CardMedia, Typography, Button } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useNavigate } from 'react-router-dom'
import { slotType, useBookingContext } from '~/contexts/BookingContext'

export interface PODRoomTypeCardProps {
  id: number
  name: string
  price: number
  quantity: number
  capacity: number
  image: string
  building: {
    id: number
    address: string
    description: string
    hotlineNumber: string
    status: string
    createdAt: string
    updatedAt: string
  }
  date: string | null
  timeSlot: slotType[]
}

const PODRoomTypeCard: React.FC<PODRoomTypeCardProps> = ({
  id,
  name,
  price,
  quantity,
  capacity,
  image,
  building,
  date,
  timeSlot
}) => {
  const navigate = useNavigate()
  const { setBookingData } = useBookingContext()

  const handleBookRoom = () => {
    setBookingData({
      roomType: { id, name, price, quantity, capacity, building },
      selectedRooms: [],
      date: date,
      timeSlots: timeSlot,
      servicePackage: null
    })
    navigate(`/room-details/${id}`)
  }

  return (
    <Card
      sx={{ display: 'flex', borderRadius: '16px', mb: '40px', justifyContent: 'space-between', border: '1px solid' }}
      elevation={0}
    >
      <Grid container>
        <Grid size={4}>
          <CardMedia
            component='img'
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            image={image}
            alt={name}
          />
        </Grid>
        <Grid container size={8} sx={{ padding: '24px' }}>
          <Grid size={10} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'start' }}>
            <Typography component='div' variant='subtitle1' fontWeight='bold'>
              {name}
            </Typography>
            <Typography variant='subtitle2' color='text.secondary' component='div'>
              <b>Địa chỉ:</b> {building.address}
            </Typography>
            <Typography variant='subtitle2' color='text.secondary' sx={{ mt: 1 }}>
              <b>Mô tả:</b> {building.description}
            </Typography>
            <Typography variant='subtitle2' color='text.secondary' sx={{ mt: 1 }}>
              <b>Dung Lượng:</b> {capacity}
            </Typography>
            <Typography variant='subtitle2' color='text.secondary' sx={{ mt: 1 }}>
              <b>Số lượng phòng:</b> {quantity}
            </Typography>
            <Typography variant='subtitle2' color='text.secondary' sx={{ mt: 1 }}>
              <b>Tiện ích:</b> Wi-fi tốc độ cao, Điều hòa, Bàn ghế thoải mái, Ổ cắm điện
            </Typography>
          </Grid>
          <Grid
            size={2}
            sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end' }}
          >
            <Typography variant='h6' component='div' color='primary' fontWeight='bold'>
              {price.toLocaleString()}
              <Typography
                component='span'
                sx={{
                  color: 'var(--Grey-grey-400, #6A6A77)',
                  fontFamily: 'Roboto',
                  fontSize: '16px',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: '120%',
                  marginLeft: '4px'
                }}
              >
                VND/tiếng
              </Typography>
            </Typography>
            <Button
              variant='contained'
              color='primary'
              onClick={handleBookRoom}
              sx={{ borderRadius: '96px', paddingX: '22px', paddingY: '8px' }}
            >
              ĐẶT PHÒNG
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  )
}

export default PODRoomTypeCard
