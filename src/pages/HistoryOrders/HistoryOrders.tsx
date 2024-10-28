import { Typography, Box, Card, CardContent, CardMedia, Chip, Divider, Pagination, Button } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useEffect, useState } from 'react'
import { useGetListOrderDetail } from '~/queries/useOrderDetail'
import { formatCurrency } from '~/utils/currency'
import { OrderDetailType } from '~/schemaValidations/orderDetail.schema'
import { useAppContext } from '~/contexts/AppProvider'
import { getDayNumber, getHour, getMonthNumber, getWeekdayNumber } from '~/utils/utils'
import { useNavigate } from 'react-router-dom'

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function BookingCard({ booking, index }: { booking: OrderDetailType; index: number }) {
  const navigate = useNavigate()
  // const priceQuantityTotal = booking.amenities.reduce((total, amenity) => {
  //   total += amenity.price * amenity.quantity
  //   return total
  // }, 0)

  // const priceTotal = priceQuantityTotal + booking.priceRoom
  const handleClick = () => {
    navigate(`/edit-booking/${booking.id}`)
  }

  return (
    <Card
      sx={{
        height: { xs: 'auto', md: '320px' },
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
      <Grid height={'100%'} component={Box} container>
        <Grid height={'100%'} size={{ xs: 12, md: 4 }}>
          <Box sx={{ height: '100%' }}>
            <CardMedia
              component='img'
              src={booking.roomImage}
              alt={booking.roomName}
              sx={{
                height: '100%',
                width: '100%',
                objectFit: 'cover',
                borderRadius: '16px',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            />
          </Box>
        </Grid>
        <Grid height={'100%'} size={{ xs: 12, md: 8 }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Chip
                    label={booking.status === 'Successfully' ? 'Đã xác nhận đặt phòng' : 'Phòng đã được hủy'}
                    color={getStatusColor(booking.status)}
                    sx={{ fontWeight: 'bold' }}
                  />
                  <Typography variant='h5' component='div' sx={{ mt: 1 }}>
                    {booking.roomName}
                  </Typography>
                </Box>
                {/* Status, Check-in, and Check-out tags */}
                <Box sx={{ display: 'flex', gap: 0.8 }}>
                  <Box>
                    <Typography variant='body1' color='text.secondary' sx={{ textTransform: 'uppercase' }}>
                      Nhận phòng
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant='body1' sx={{ flex: 1, fontSize: '2rem', textAlign: 'center' }}>
                        {getDayNumber(booking.startTime)}
                      </Typography>
                      <Box gap={0.5} padding={0.5}>
                        <Box>thg {getMonthNumber(booking.startTime)}</Box>
                        <Box>Th {getWeekdayNumber(booking.startTime)}</Box>
                      </Box>
                    </Box>
                  </Box>
                  <Divider orientation='vertical' flexItem />
                  <Box>
                    <Typography variant='body1' color='text.secondary' sx={{ textTransform: 'uppercase' }}>
                      Trả phòng
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant='body1' sx={{ flex: 1, fontSize: '2rem', textAlign: 'center' }}>
                        {getDayNumber(booking.endTime)}
                      </Typography>
                      <Box gap={0.5} padding={0.5}>
                        <Box>thg {getMonthNumber(booking.endTime)}</Box>
                        <Box>Th {getWeekdayNumber(booking.endTime)}</Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Typography color='text.secondary' gutterBottom>
                Mã đơn: {booking.id}
              </Typography>
              <Typography color='text.secondary' gutterBottom>
                Khung giờ: {getHour(booking.startTime)}:00-{getHour(booking.endTime)}:00
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant='h6' component='div' sx={{ mr: 1 }}>
                  Giá thuê: {formatCurrency(booking.priceRoom)}/giờ
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant='subtitle1' gutterBottom>
                Dịch vụ đặt thêm: {booking.amenities.length > 0 ? 'Có' : 'Không có'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Box sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}></Box>
              <Button variant='contained' onClick={handleClick}>
                Xem chi tiết hóa đơn
              </Button>
            </Box>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  )
}

export default function HistoryOrders() {
  const [page, setPage] = useState(1)
  const { account } = useAppContext()
  const [selectedTag, setSelectedTag] = useState('Successfully') // Default selection

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag)
  }
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [page])
  const { data } = useGetListOrderDetail({
    page: page,
    take: 3,
    customerId: account?.id as string,
    status: selectedTag
  })
  const listOrders = data?.data
  console.log(listOrders?.data)
  const handleChangePage = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
  }
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        padding: '24px 180px',
        backgroundColor: '#F9FAFB',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography variant='h4' gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold', mb: 4 }}>
        Lịch sử đặt phòng
      </Typography>

      <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
        <Box
          onClick={() => handleTagClick('Successfully')}
          sx={{
            cursor: 'pointer',
            position: 'relative',
            color: selectedTag === 'Successfully' ? 'primary.main' : 'text.secondary',
            fontWeight: selectedTag === 'Successfully' ? 'bold' : 'normal',
            '&::after': {
              content: '""',
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: -4,
              height: '3px',
              backgroundColor: selectedTag === 'Successfully' ? 'primary.main' : 'transparent',
              transition: 'all 0.3s ease'
            }
          }}
        >
          Đã hoàn tất
        </Box>

        <Box
          onClick={() => handleTagClick('Rejected')}
          sx={{
            cursor: 'pointer',
            position: 'relative',
            color: selectedTag === 'Rejected' ? 'primary.main' : 'text.secondary',
            fontWeight: selectedTag === 'Rejected' ? 'bold' : 'normal',
            '&::after': {
              content: '""',
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: -4,
              height: '3px',
              backgroundColor: selectedTag === 'Rejected' ? 'primary.main' : 'transparent',
              transition: 'all 0.3s ease'
            }
          }}
        >
          Đã hủy
        </Box>
      </Box>

      <Box
        sx={{ flexGrow: 1, minHeight: '300px', display: 'flex', flexDirection: 'column' }}
        height={{ xs: 'auto', md: '100%' }}
      >
        {listOrders ? (
          listOrders.data.map((booking, index) => <BookingCard key={booking.id} booking={booking} index={index} />)
        ) : (
          <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>Không có dữ liệu để hiển thị.</Typography>
        )}
      </Box>

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
