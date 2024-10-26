import { Avatar, Box, Button, Divider, Typography, useTheme } from '@mui/material'
import { tokens } from '~/themes/theme'

export default function OrderBooking() {
  const theme = useTheme()
  const colors = tokens('light')
  return (
    <Box sx={{ bgcolor: 'white', borderRadius: 2, boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)' }}>
      <Box sx={{ padding: '20px' }}>
        <Typography variant='h5' color={theme.palette.primary.main} gutterBottom fontWeight='bold'>
          Đơn đặt
        </Typography>
        <Box display='flex' alignItems='center' sx={{ marginTop: '24px' }} gap='20px'>
          <Avatar
            alt='phong 2 nguoi'
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
          >
            <Typography variant='h5' fontWeight='bold'>
              phòng 2 người
            </Typography>
            <Box display='flex' sx={{ marginTop: '4px' }}>
              <Typography variant='subtitle2' color={theme.palette.primary.main}>
                1000 VND
              </Typography>
              <Typography variant='subtitle2'>/tiếng</Typography>
            </Box>
            <Box sx={{ marginTop: '12px' }} flexDirection='column' display='flex' gap='12px'>
              <Box display='flex' gap='3px'>
                <Typography variant='body2' fontWeight='bold'>
                  Địa chỉ:
                </Typography>
                <Typography variant='body2'>Thủ Đức</Typography>
              </Box>
              <Box display='flex' gap='3px'>
                <Typography variant='body2' fontWeight='bold'>
                  Ngày:
                </Typography>
                <Typography variant='body2'>12/2024</Typography>
              </Box>
              <Box display='flex' gap='3px'>
                <Typography variant='body2' fontWeight='bold'>
                  Slot:
                </Typography>
                <Typography variant='body2'>2:00 - 5:00</Typography>
              </Box>
              <Box display='flex' gap='3px'>
                <Typography variant='body2' fontWeight='bold'>
                  Phòng:
                </Typography>
                <Typography variant='body2'>abc</Typography>
              </Box>
              <Box display='flex' gap='3px'>
                <Typography variant='body2' fontWeight='bold'>
                  Gói dịch vụ:
                </Typography>
                <Typography variant='body2'>(2 ngày)</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ padding: '20px' }} display='flex' flexDirection='column' gap='20px'>
        <Box display='flex' justifyContent='space-between'>
          <Typography variant='subtitle2' color={theme.palette.grey[500]}>
            Tổng các phòng:
          </Typography>
          <Typography variant='subtitle2' fontWeight='bold'>
            100000 VND
          </Typography>
        </Box>
        <Box display='flex' justifyContent='space-between'>
          <Typography variant='subtitle2' color={theme.palette.grey[500]}>
            Tổng các dịch vụ:
          </Typography>
          <Typography variant='subtitle2' fontWeight='bold'>
            10000 VND
          </Typography>
        </Box>
        <Box display='flex' justifyContent='space-between'>
          <Typography variant='subtitle2' color={theme.palette.grey[500]}>
            Giảm giá: (gói ngày 5%)
          </Typography>
          <Typography variant='subtitle2' fontWeight='bold'>
            100000 VND
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ padding: '20px' }} display='flex' justifyContent='space-between'>
        <Typography variant='subtitle2' color={theme.palette.grey[500]}>
          Tổng đơn:
        </Typography>
        <Typography variant='subtitle2' fontWeight='bold'>
          10000 VND
        </Typography>
      </Box>
      <Box sx={{ width: '100%', padding: '20px' }}>
        <Button fullWidth sx={{ background: colors.primary[500], color: '#FFF', borderRadius: 'var(--12, 96px)' }}>
          Hủy đặt phòng
        </Button>
      </Box>
    </Box>
  )
}
