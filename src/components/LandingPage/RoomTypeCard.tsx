import React from 'react'
import { Card, CardMedia, Typography, Button, Box, Grow } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useNavigate } from 'react-router-dom'
import { slotType, useBookingContext } from '~/contexts/BookingContext'
import { motion } from 'framer-motion'

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
    <Grow in={true} timeout={500}>
      <Card
        component={motion.div}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          borderRadius: '16px',
          mb: '24px',
          border: '1px solid',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
        elevation={0}
      >
        <Grid container>
          <Grid size={{ xs: 12, md: 4 }}>
            <CardMedia
              component='img'
              sx={{
                width: '100%',
                height: { xs: '200px', md: '100%' },
                objectFit: 'cover',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
              image={image}
              alt={name}
            />
          </Grid>
          <Grid container size={{ xs: 12, md: 8 }} sx={{ p: { xs: 2, md: 3 } }}>
            <Grid size={{ xs: 12, md: 10 }} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant='h6' fontWeight='bold' color='primary'>
                {name}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                <Box component='span' fontWeight='bold'>
                  Địa chỉ:
                </Box>{' '}
                {building.address}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                <Box component='span' fontWeight='bold'>
                  Mô tả:
                </Box>{' '}
                {building.description}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                <Box component='span' fontWeight='bold'>
                  Dung Lượng:
                </Box>{' '}
                {capacity} người
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                <Box component='span' fontWeight='bold'>
                  Số lượng phòng:
                </Box>{' '}
                {quantity}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                <Box component='span' fontWeight='bold'>
                  Tiện ích:
                </Box>{' '}
                Wi-fi tốc độ cao, Điều hòa, Bàn ghế thoải mái, Ổ cắm điện
              </Typography>
            </Grid>
            <Grid
              size={{ xs: 12, md: 2 }}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'row', md: 'column' },
                justifyContent: 'space-between',
                alignItems: { xs: 'center', md: 'flex-end' },
                mt: { xs: 2, md: 0 }
              }}
            >
              <Typography variant='h6' color='primary' fontWeight='bold' sx={{ mb: { xs: 0, md: 2 } }}>
                {price.toLocaleString()}
                <Typography
                  component='span'
                  sx={{
                    color: 'text.secondary',
                    fontSize: '14px',
                    fontWeight: 400,
                    ml: 0.5
                  }}
                >
                  VND/tiếng
                </Typography>
              </Typography>
              <Button
                variant='contained'
                color='primary'
                onClick={handleBookRoom}
                sx={{
                  borderRadius: '96px',
                  px: 3,
                  py: 1,
                  width: { xs: 'auto', md: '100%' },
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                  }
                }}
              >
                ĐẶT PHÒNG
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </Grow>
  )
}

export default PODRoomTypeCard
