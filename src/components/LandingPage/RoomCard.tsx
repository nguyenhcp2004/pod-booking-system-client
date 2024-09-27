import React from 'react'
import { Card, CardMedia, Typography, Button } from '@mui/material'
import Grid from '@mui/material/Grid2'

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
    <>
      <Card
        sx={{ display: 'flex', borderRadius: '16px', mb: '40px', justifyContent: 'space-between', border: '1px solid' }}
        elevation={0}
      >
        <Grid size={4}>
          <CardMedia component='img' sx={{ width: '100%', height: '100%' }} image={image} alt={name} />
        </Grid>
        <Grid container size={8} sx={{ padding: '24px 24px 24px 0px' }}>
          {/* <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}> */}
          {/* <CardContent sx={{ flex: '1 0 auto', p: 2 }}> */}
          <Grid size={{ xs: 10 }} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'start' }}>
            <Typography component='div' variant='subtitle1' fontWeight='bold'>
              {name}
            </Typography>
            <Typography variant='subtitle2' color='text.secondary' component='div'>
              <b>Địa chỉ:</b> {address}
            </Typography>
            <Typography variant='subtitle2' color='text.secondary' sx={{ mt: 1 }}>
              <b>Mô tả:</b> {description}
            </Typography>
            <Typography variant='subtitle2' color='text.secondary' sx={{ mt: 1 }}>
              <b>Dung Lượng:</b> {capacity}
            </Typography>
            <Typography variant='subtitle2' color='text.secondary' sx={{ mt: 1 }}>
              <b>Tiện ích:</b> {amenities}
            </Typography>
          </Grid>
          <Grid size={{ xs: 2 }} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'end' }}>
            <Typography variant='h6' component='div' color='primary' fontWeight='bold'>
              {price}
            </Typography>
            <Button
              variant='contained'
              color='primary'
              onClick={onBookRoom}
              sx={{ borderRadius: '96px', paddingX: '22px', paddingY: '8px' }}
            >
              ĐẶT PHÒNG
            </Button>
          </Grid>
          {/* </CardContent> */}
          {/* </Box> */}
        </Grid>
      </Card>
    </>
  )
}

export default PODRoomCard
