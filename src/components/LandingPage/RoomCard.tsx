import React from 'react'
import { Card, CardContent, CardMedia, Typography, Button, Box, Grid } from '@mui/material'

interface PODRoomCardProps {
  image: string
  name: string
  address: string
  description: string
  capacity: string
  amenities: string
  price: string
  onBookRoom: () => void
}

const PODRoomCard: React.FC<PODRoomCardProps> = ({
  image,
  name,
  address,
  description,
  capacity,
  amenities,
  price,
  onBookRoom
}) => {
  return (
    <Grid item xs={12}>
      <Card sx={{ display: 'flex', borderRadius: '16px', overflow: 'hidden', mb: '40px' }}>
        <CardMedia component='img' sx={{ width: 300 }} image={image} alt={name} />
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <CardContent sx={{ flex: '1 0 auto', p: 2 }}>
            <Typography component='div' variant='h5' fontWeight='bold'>
              {name}
            </Typography>
            <Typography variant='subtitle1' color='text.secondary' component='div'>
              Địa chỉ: {address}
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
              Mô tả: {description}
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
              Dung Lượng: {capacity}
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
              Tiện ích: {amenities}
            </Typography>
          </CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
            <Typography variant='h6' component='div' color='primary' fontWeight='bold'>
              {price}
            </Typography>
            <Button variant='contained' color='primary' onClick={onBookRoom}>
              ĐẶT PHÒNG
            </Button>
          </Box>
        </Box>
      </Card>
    </Grid>
  )
}

export default PODRoomCard
