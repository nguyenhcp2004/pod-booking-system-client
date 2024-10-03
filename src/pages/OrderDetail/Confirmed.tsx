import { Avatar, Box, Button, Divider, Grid, Paper, Typography } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

interface CommonProps {
  onNext: () => void
  onBack: () => void
}

export const Confirmed: React.FC<CommonProps> = (props) => {
  const bookingInfo = {
    orderId: '#ABCXYZ',
    customerName: 'Phạm Thị Anh Đào',
    totalPrice: 1374000,
    roomType: 'Phòng POD đôi',
    pricePerHour: 20000,
    address: 'Đố m biết',
    date: '24/01/2024',
    timeSlots: '7h - 9h, 9h - 11h',
    rooms: ['Phòng 101', 'Phòng 102'],
    package: 'Gói tuần',
    imageSrc: '/path-to-image'
  }
  return (
    <Box sx={{ marginX: '104px' }}>
      <Box sx={{ minHeight: '100vh' }}>
        <Paper elevation={3} sx={{ maxWidth: 800, mx: 'auto', p: 4 }}>
          <Box textAlign='center'>
            <CheckCircleIcon sx={{ fontSize: 60, color: 'green' }} />
            <Typography variant='h4' fontWeight='bold' gutterBottom>
              Đặt phòng thành công
            </Typography>
          </Box>
          <Box sx={{ my: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant='body2' color='textSecondary'>
                  Mã đơn
                </Typography>
                <Typography variant='body1' fontWeight='bold'>
                  {bookingInfo.orderId}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant='body2' color='textSecondary'>
                  Tên khách hàng
                </Typography>
                <Typography variant='body1' fontWeight='bold'>
                  {bookingInfo.customerName}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant='body2' color='textSecondary'>
                  Tổng đơn
                </Typography>
                <Typography variant='body1' fontWeight='bold'>
                  {bookingInfo.totalPrice.toLocaleString()} VND
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 2 }} />
          <Box display='flex' alignItems='center'>
            <Avatar
              src={bookingInfo.imageSrc}
              alt={bookingInfo.roomType}
              sx={{ width: 120, height: 120, mr: 2 }}
              variant='rounded'
            />
            <Box>
              <Typography variant='h6' fontWeight='bold'>
                {bookingInfo.roomType}
              </Typography>
              <Typography variant='body1' color='primary'>
                {bookingInfo.pricePerHour.toLocaleString()} VND/tiếng
              </Typography>
              <Typography variant='body2'>Địa chỉ: {bookingInfo.address}</Typography>
              <Typography variant='body2'>Ngày: {bookingInfo.date}</Typography>
              <Typography variant='body2'>Slot: {bookingInfo.timeSlots}</Typography>
              <Typography variant='body2'>Phòng: {bookingInfo.rooms.join(', ')}</Typography>
              <Typography variant='body2'>Gói: {bookingInfo.package}</Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button onClick={props.onBack} sx={{ mr: 1 }}>
          Quay lại
        </Button>
        <Button variant='contained' onClick={props.onNext}>
          Tiếp tục
        </Button>
      </Box>
    </Box>
  )
}
