import { Avatar, Box, Button, Divider, Typography, useTheme } from '@mui/material'
import { GridCheckCircleIcon } from '@mui/x-data-grid'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '~/contexts/AppProvider'

export default function CancelBookingSuccess() {
  const theme = useTheme()
  const { account } = useAppContext()
  const navigate = useNavigate()
  const handleReturn = () => {
    localStorage.setItem('bookingData', JSON.stringify({}))
    navigate('/')
  }
  return (
    <Box sx={{ marginX: '104px' }}>
      <Box
        sx={{
          bgcolor: 'white',
          width: '100%',
          mx: 'auto',
          minHeight: '70vh',
          py: '108px'
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pb: '70px' }}>
          <Box sx={{ width: '40%', textAlign: 'center' }}>
            <GridCheckCircleIcon sx={{ fontSize: 50, color: theme.palette.success.main }} />
            <Typography variant='h3' fontWeight='bold' gutterBottom>
              Hủy đặt phòng thành công
            </Typography>

            <Box sx={{ my: '32px', textAlign: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='subtitle2' color={theme.palette.grey[500]}>
                    Tên khách hàng
                  </Typography>
                  <Typography variant='subtitle2' fontWeight='bold'>
                    {account?.name}
                  </Typography>
                </Box>
                <Divider />
              </Box>
            </Box>

            <Box display='flex' gap='20px' alignItems='center' sx={{ p: '20px' }}>
              <Avatar
                src='https://i.pinimg.com/564x/a6/9f/9a/a69f9a8dff671e8fa5e111df785d0fcb.jpg'
                alt='FlexiPod'
                sx={{ width: '200px', height: '193px', borderRadius: '16px' }}
                variant='rounded'
              />
            </Box>
          </Box>
        </Box>
        <Box display='flex' justifyContent='flex-end' gap='10px' sx={{ mr: '38px' }}>
          <Button variant='contained' onClick={handleReturn}>
            Trở về trang chủ
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
