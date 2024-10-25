import { Box, Button, TextField } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Typography, Divider, useTheme, Avatar } from '@mui/material'
import ModeCommentIcon from '@mui/icons-material/ModeComment'

import { tokens } from '~/themes/theme'

export default function EditBooking() {
  const theme = useTheme()
  const colors = tokens('light')
  return (
    <Box sx={{ height: '100%', padding: '24px 104px', backgroundColor: colors.grey[50] }}>
      <Box>
        <Grid container>
          <Grid size={{ xs: 12, md: 6 }} sx={{ paddingRight: '12px', mt: 2 }}>
            <Box sx={{ bgcolor: 'white' }}>
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
                {/* <Box sx={{ marginTop: '24px', paddingY: '20px' }}>
          {0 > 0 && (
            <Typography variant='subtitle1' gutterBottom color={theme.palette.primary.main}>
              Dịch vụ bạn đã chọn
            </Typography>
          )}
          {bookingData.selectedRooms.map((room, index) => {
            if (room.amenities.length === 0) return null
            return (
              <Box key={index}>
                <RoomAmenitiesCard room={room} removeAmenity={removeAmenity} />
                {index !== roomHaveAmenities - 1 && <Divider sx={{ my: '20px' }} />}
              </Box>
            )
          })}
        </Box> */}
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
                <Button
                  fullWidth
                  sx={{ background: colors.primary[500], color: '#FFF', borderRadius: 'var(--12, 96px)' }}
                >
                  Hủy đặt phòng
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{ paddingRight: '12px', mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <Box sx={{ bgcolor: 'white', padding: '20px' }}>
              <Typography variant='h5' sx={{ color: colors.primary[500], fontWeight: '700' }}>
                Thông tin khách hàng
              </Typography>
              <Box sx={{ paddingTop: '24px' }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }} sx={{ marginBottom: 'auto', paddingTop: '25px !important' }}>
                    <TextField
                      id='outlined-required'
                      label='Tên'
                      defaultValue='Phạm Thị Anh Đào'
                      fullWidth
                      InputProps={{
                        readOnly: true
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }} sx={{ marginBottom: 'auto', paddingTop: '25px !important' }}>
                    <TextField
                      id='outlined-required'
                      label='Số điện thoại'
                      defaultValue='09xxxxxxxx'
                      fullWidth
                      InputProps={{
                        readOnly: true
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }} sx={{ marginBottom: 'auto', paddingTop: '25px !important' }}>
                    <TextField
                      id='outlined-required'
                      label='Email'
                      defaultValue='dao@gmail.com'
                      fullWidth
                      InputProps={{
                        readOnly: true
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Box sx={{ bgcolor: 'white', padding: '20px' }}>
              <Typography variant='h5' sx={{ color: colors.primary[500], fontWeight: '700' }}>
                Miễn phí hủy đặt phòng
              </Typography>
              <Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }} sx={{ marginBottom: 'auto', paddingTop: '1rem' }}>
                    <Box>
                      Để hủy miễn phí, bạn cần phải hủy <b>trước</b> ngày 17 Tháng 11 23:59 giờ Cần Thơ. Sau thời gian
                      này, bạn sẽ phải thanh toán VND 350.000 để hủy.
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <Typography variant='h5' sx={{ color: colors.primary[500], fontWeight: '700' }}>
                Có thắc mắc ?
              </Typography>
              <Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }} sx={{ marginBottom: 'auto', paddingTop: '1rem' }}>
                    <Box>Liên hệ hệ thống hỗ trợ nếu bạn có thắc mắc hay yêu cầu đặc biệt nào</Box>
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ width: '100%', padding: '20px' }}>
                <Button
                  startIcon={<ModeCommentIcon />}
                  fullWidth
                  sx={{ background: colors.primary[500], color: '#FFF', borderRadius: 'var(--12, 96px)' }}
                >
                  Tin nhắn mới
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
