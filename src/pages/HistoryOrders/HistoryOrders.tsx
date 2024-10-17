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
  Zoom
} from '@mui/material'
import { Wifi, RoomService, Pool, LocalCafe, BusinessCenter, Security, Hotel } from '@mui/icons-material'
import Grid from '@mui/material/Grid2'

const bookings = [
  {
    id: 'BK001',
    date: '2023-05-01',
    total: 385.99,
    status: 'Completed',
    rating: 4.5,
    room: {
      name: 'room test 1',
      price: 259.99,
      image: 'https://i.pinimg.com/enabled_lo/564x/a0/a3/57/a0a357281197e7c7bea13028eb461695.jpg'
    },
    amenities: [
      { name: 'Wi-Fi', price: 0 },
      { name: 'Cà phê', price: 30 },
      { name: 'Pizza', price: 30 },
      { name: 'Máy chiếu', price: 66.0 }
    ]
  },
  {
    id: 'BK002',
    date: '2023-06-15',
    total: 619.99,
    status: 'Upcoming',
    rating: null,
    room: {
      name: 'room test 2',
      price: 449.99,
      image: 'https://i.pinimg.com/enabled_lo/564x/a0/a3/57/a0a357281197e7c7bea13028eb461695.jpg'
    },
    amenities: [
      { name: 'Wi-Fi', price: 0 },
      { name: 'Cà phê', price: 30 },
      { name: 'Pizza', price: 30 },
      { name: 'Máy chiếu', price: 66.0 }
    ]
  },
  {
    id: 'BK003',
    date: '2023-04-22',
    total: 969.99,
    status: 'Completed',
    rating: 5,
    room: {
      name: 'room test 3',
      price: 799.99,
      image: 'https://i.pinimg.com/enabled_lo/564x/a0/a3/57/a0a357281197e7c7bea13028eb461695.jpg'
    },
    amenities: [
      { name: 'Wi-Fi', price: 0 },
      { name: 'Cà phê', price: 30 },
      { name: 'Pizza', price: 30 },
      { name: 'Máy chiếu', price: 66.0 }
    ]
  }
]

const getStatusColor = (status) => {
  switch (status) {
    case 'Completed':
      return 'success'
    case 'Upcoming':
      return 'primary'
    case 'Cancelled':
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

function BookingCard({ booking, index }) {
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
              image={booking.room.image}
              alt={booking.room.name}
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
                    {booking.room.name}
                  </Typography>
                  <Chip label={booking.status} color={getStatusColor(booking.status)} sx={{ fontWeight: 'bold' }} />
                </Box>
                <Typography color='text.secondary' gutterBottom>
                  Mã đơn: {booking.id} | Ngày: {booking.date}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant='h6' component='div' sx={{ mr: 1 }}>
                    Giá thuê: 20.000đ/h
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Typography variant='subtitle1' gutterBottom>
                  Tiện ích:
                </Typography>
                <Grid container spacing={2} sx={{ width: '100%', flexGrow: 1 }}>
                  <Grid size={4}>
                    <List dense>
                      {booking.amenities.map((amenity, index) => (
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
                  <Grid size={4}>
                    <List dense>
                      {booking.amenities.map((amenity, index) => (
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
  return (
    <Box sx={{ width: '100%', padding: '24px 104px', backgroundColor: '#F9FAFB' }}>
      <Typography variant='h4' gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold', mb: 4 }}>
        Lịch sử đặt phòng
      </Typography>
      {bookings.map((booking, index) => (
        <BookingCard key={booking.id} booking={booking} index={index} />
      ))}
    </Box>
  )
}
