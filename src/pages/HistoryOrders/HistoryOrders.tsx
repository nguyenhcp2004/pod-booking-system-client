import {
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Grow,
  Zoom,
  Pagination
} from '@mui/material'
import { Wifi, RoomService, Pool, LocalCafe, BusinessCenter, Security, Hotel } from '@mui/icons-material'
import Grid from '@mui/material/Grid2'
import { useState } from 'react'
import { useGetListOrderDetail } from '~/queries/useOrderDetail'
import { formatCurrency } from '~/utils/currency'
import { OrderDetailType } from '~/schemaValidations/orderDetail.schema'

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Successfully':
      return 'success'
    case 'Pending':
      return 'primary'
    case 'Rejected':
      return 'error'
    default:
      return 'default'
  }
}

const getAmenityIcon = (amenity) => {
  switch (amenity.toLowerCase()) {
    case 'free wi-fi':
      return <Wifi />
    case 'room service':
      return <RoomService />
    case 'pool access':
      return <Pool />
    case 'complimentary breakfast':
      return <LocalCafe />
    case 'business center':
      return <BusinessCenter />
    case 'in-room safe':
      return <Security />
    default:
      return <Hotel />
  }
}

function BookingCard({ booking, index }: { booking: OrderDetailType; index: number }) {
  return (
    <Grow in={true} timeout={500 + index * 250}>
      <Card
        sx={{
          height: 'auto',
          mb: 4,
          overflow: 'visible',
          borderRadius: '16px',
          border: '1px solid',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)'
          }
        }}
      >
        <Grid container>
          <Grid size={{ xs: 12, md: 4 }}>
            <CardMedia
              component='img'
              image='https://i.pinimg.com/enabled_lo/564x/a0/a3/57/a0a357281197e7c7bea13028eb461695.jpg'
              alt={booking.roomName}
              sx={{
                height: '100%',
                objectFit: 'cover',
                borderRadius: '16px',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant='h5' component='div'>
                    {booking.roomName}
                  </Typography>
                  <Chip label={booking.status} color={getStatusColor(booking.status)} sx={{ fontWeight: 'bold' }} />
                </Box>
                <Typography color='text.secondary' gutterBottom>
                  Mã đơn: {booking.id} | Ngày: {booking.startTime}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant='h6' component='div' sx={{ mr: 1 }}>
                    Giá thuê: {formatCurrency(booking.priceRoom)}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Typography variant='subtitle1' gutterBottom>
                  Tiện ích:
                </Typography>
                <Grid container spacing={2} sx={{ width: '100%', flexGrow: 1 }}>
                  <Grid size={4}>
                    <List dense>
                      {booking.amenities.slice(0, 4).map((amenity, index) => (
                        <ListItem key={index} disablePadding>
                          <ListItemIcon>
                            <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                              <BusinessCenter />
                            </Zoom>
                          </ListItemIcon>
                          <ListItemText
                            primary={amenity.name}
                            secondary={
                              amenity.price === 0
                                ? 'Miễn phí'
                                : formatCurrency(amenity.price) + `  x ${amenity.quantity}`
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                  <Grid size={4}>
                    <List dense>
                      {booking.amenities.slice(4, 8).map((amenity, index) => (
                        <ListItem key={index} disablePadding>
                          <ListItemIcon>
                            <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                              {getAmenityIcon(amenity.name)}
                            </Zoom>
                          </ListItemIcon>
                          <ListItemText
                            primary={amenity.name}
                            secondary={amenity.price === 0 ? 'Miễn phí' : '20.000đ'}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Box />
                <Box sx={{ fontWeight: 'bold' }}>Tổng tiền: 100K</Box>
              </Box>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Grow>
  )
}

export default function HistoryOrders() {
  const [page, setPage] = useState(1)
  const { data } = useGetListOrderDetail({
    page: page,
    take: 3,
    customerId: '93619322-b041-4323-af50-9fe07e6c5bf4'
  })
  const listOrders = data?.data
  const handleChangePage = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
  }
  return (
    <Box sx={{ width: '100%', padding: '24px 104px', backgroundColor: '#F9FAFB' }}>
      <Typography variant='h4' gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold', mb: 4 }}>
        Lịch sử đặt phòng
      </Typography>
      {listOrders?.data.map((booking, index) => <BookingCard key={booking.id} booking={booking} index={index} />)}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination
          count={listOrders?.totalPage ?? 1}
          page={page}
          onChange={handleChangePage}
          showFirstButton
          showLastButton
        />
      </Box>
    </Box>
  )
}
