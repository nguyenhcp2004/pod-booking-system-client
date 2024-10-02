import React from 'react'
import { Card, CardMedia, Typography, Button } from '@mui/material'
import Grid from '@mui/material/Grid2'

// interface PODRoomCardProps {
//   roomId: number
//   roomName: string
//   price: number
//   roomDescription: string
//   image: string
//   roomStatus: string
//   roomCreatedAt: string
//   roomUpdatedAt: string
//   roomType: {
//     roomTypeId: number
//     roomTypeName: string
//     roomTypeQuantity: number
//     capacity: number
//     building: {
//       buildingId: number
//       address: string
//       buildingDescription: string
//       hotlineNumber: string
//       buildingStatus: string
//       buildingCreatedAt: string
//       buildingUpdatedAt: string
//     }

//   }
//   onBookRoom: () => void
// }

interface PODRoomCardProps {
  roomId: number
  roomName: string
  price: number
  roomDescription: string
  image: string
  roomStatus: string
  roomCreatedAt: string
  roomUpdatedAt: string
  roomType: {
    id: number
    name: string
    quantity: number
    capacity: number
    building: {
      id: number
      address: string
      description: string
      hotlineNumber: string
      status: string
      createdAt: string
      updatedAt: string
    }
  }
  onBookRoom: () => void
}

const PODRoomCard: React.FC<PODRoomCardProps> = ({
  roomName,
  price,
  roomDescription,
  image,
  roomType: {
    name: roomTypeName,
    capacity,
    building: { address }
  },
  onBookRoom
}) => {
  return (
    <>
      <Card
        sx={{ display: 'flex', borderRadius: '16px', mb: '40px', justifyContent: 'space-between', border: '1px solid' }}
        elevation={0}
      >
        <Grid size={4}>
          <CardMedia component='img' sx={{ width: '100%', height: '100%' }} image={image} alt={roomName} />
        </Grid>
        <Grid container size={8} sx={{ padding: '24px 24px 24px 0px' }}>
          {/* <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}> */}
          {/* <CardContent sx={{ flex: '1 0 auto', p: 2 }}> */}
          <Grid size={{ xs: 10 }} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'start' }}>
            <Typography component='div' variant='subtitle1' fontWeight='bold'>
              {roomTypeName}
            </Typography>
            <Typography variant='subtitle2' color='text.secondary' component='div'>
              <b>Địa chỉ:</b> {address}
            </Typography>
            <Typography variant='subtitle2' color='text.secondary' sx={{ mt: 1 }}>
              <b>Mô tả:</b> {roomDescription}
            </Typography>
            <Typography variant='subtitle2' color='text.secondary' sx={{ mt: 1 }}>
              <b>Dung Lượng:</b> {capacity}
            </Typography>
            <Typography variant='subtitle2' color='text.secondary' sx={{ mt: 1 }}>
              <b>Tiện ích:</b> Wi-fi tốc độ cao, Điều hòa, Bàn ghế thoải mái, Ổ cắm điện
            </Typography>
          </Grid>
          <Grid size={{ xs: 2 }} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'end' }}>
            <Typography variant='h6' component='div' color='primary' fontWeight='bold'>
              {price}
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
