import { Avatar, Box, Button, Divider, Paper, Typography, useTheme } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useNavigate } from 'react-router-dom'

export const Confirmed: React.FC = () => {
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
    imageSrc: 'https://i.pinimg.com/736x/1a/ea/75/1aea75b50d0a133a83e550757b993db7.jpg'
  }
  const theme = useTheme()
  const navigate = useNavigate()

  const handleReturn = () => {
    console.log('Back to homepage')
    localStorage.setItem('activeStep', '1')
    navigate('/')
  }
  return (
    <Box sx={{ marginX: '104px' }}>
      <Box>
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            mx: 'auto',
            minHeight: '70vh',
            display: 'flex',
            justifyContent: 'center',
            paddingY: '108px'
          }}
        >
          <Box sx={{ width: '40%' }}>
            <Box textAlign='center'>
              <CheckCircleIcon sx={{ fontSize: 50, color: theme.palette.success.main }} />
              <Typography variant='h3' fontWeight='bold' gutterBottom>
                Đặt phòng thành công
              </Typography>
            </Box>
            <Box sx={{ marginY: '32px' }} textAlign='center'>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='subtitle2' color={theme.palette.grey[500]}>
                    Mã đơn
                  </Typography>
                  <Typography variant='subtitle2' fontWeight='bold'>
                    {bookingInfo.orderId}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='subtitle2' color={theme.palette.grey[500]}>
                    Tên khách hàng
                  </Typography>
                  <Typography variant='subtitle2' fontWeight='bold'>
                    {bookingInfo.customerName}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='subtitle2' color={theme.palette.grey[500]}>
                    Tổng đơn
                  </Typography>
                  <Typography variant='subtitle2' fontWeight='bold'>
                    {bookingInfo.totalPrice.toLocaleString()} VND
                  </Typography>
                </Box>
                <Divider />
              </Box>
            </Box>

            <Box display='flex' gap='20px' alignItems='center' sx={{ padding: '20px' }}>
              <Avatar
                src={bookingInfo.imageSrc}
                alt={bookingInfo.roomType}
                sx={{ width: '200px', height: '193px', borderRadius: '16px' }}
                variant='rounded'
              />
              <Box
                sx={{
                  minHeight: '193px',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  flexDirection: 'column'
                }}
                id='hi'
              >
                <Typography variant='h5' fontWeight='bold'>
                  {bookingInfo.roomType}
                </Typography>
                <Box display='flex' sx={{ marginTop: '4px' }}>
                  <Typography variant='subtitle2' color={theme.palette.primary.main}>
                    {bookingInfo.pricePerHour.toLocaleString()} VND
                  </Typography>
                  <Typography variant='subtitle2'>/tiếng</Typography>
                </Box>
                <Box sx={{ marginTop: '12px' }} flexDirection='column' display='flex' gap='12px'>
                  <Box display='flex' gap='3px'>
                    <Typography variant='body2' fontWeight='bold'>
                      Địa chỉ:
                    </Typography>
                    <Typography variant='body2'> {bookingInfo.address}</Typography>
                  </Box>
                  <Box display='flex' gap='3px'>
                    <Typography variant='body2' fontWeight='bold'>
                      Ngày:
                    </Typography>
                    <Typography variant='body2'>{bookingInfo.date}</Typography>
                  </Box>

                  <Box display='flex' gap='3px'>
                    <Typography variant='body2' fontWeight='bold'>
                      Slot:
                    </Typography>
                    <Typography variant='body2'>{bookingInfo.timeSlots}</Typography>
                  </Box>
                  <Box display='flex' gap='3px'>
                    <Typography variant='body2' fontWeight='bold'>
                      Phòng:
                    </Typography>
                    <Typography variant='body2'>{bookingInfo.rooms.join(', ')}</Typography>
                  </Box>
                  <Box display='flex' gap='3px'>
                    <Typography variant='body2' fontWeight='bold'>
                      Gói:
                    </Typography>
                    <Typography variant='body2'>{bookingInfo.package}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box display='flex' justifyContent='flex-end' gap='20px'>
              <Button>Add amenities</Button>
              <Button>Cancel booking</Button>
              <Button onClick={handleReturn}>Back to homepage</Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}
