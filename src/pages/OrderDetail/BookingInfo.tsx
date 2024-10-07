import { Box, Button, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import BookingDetails from '~/components/BookingDetails/BookingDetails'
import { tokens } from '~/themes/theme'
import moment from 'moment'
import MonthView from '~/components/Calendar/Calendar'
interface CommonProps {
  onNext: () => void
  onBack: () => void
}

export const BookingInfo: React.FC<CommonProps> = (props) => {
  const colors = tokens('light')
  return (
    <Box id='hehe' sx={{ height: '100%', marginX: '104px', paddingTop: '24px' }}>
      <Grid container spacing={2} sx={{}}>
        <Grid size={{ xs: 12, md: 6 }} sx={{ paddingRight: '24px !important', paddingTop: '0px !important' }}>
          <Box>
            <Box sx={{ padding: '20px 20px 20px 20px', minHeight: '253px', background: '#FFF' }}>
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
            <Box sx={{ marginTop: '24px', background: '#FFF' }}>
              <Box sx={{ padding: '20px' }}>
                <Typography variant='h5' sx={{ color: colors.primary[500], fontWeight: '700', paddingBottom: '20px' }}>
                  Lịch đặt
                </Typography>
                <Box>
                  <Grid size={{ xs: 12 }}>
                    <MonthView
                      selected={[
                        moment(),
                        moment().add(1, 'day'),
                        moment().add(2, 'day'),
                        moment().add(3, 'day'),
                        moment().add(4, 'day')
                      ]}
                    />
                  </Grid>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }} sx={{ paddingLeft: '0px !important', paddingTop: '0px !important' }}>
          <Box>
            <BookingDetails />
          </Box>
          <Grid
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '20px',
              paddingTop: 3,
              backgroundColor: 'white'
            }}
          >
            <Box sx={{ width: '80%' }}>
              <Button
                onClick={props.onNext}
                fullWidth
                sx={{ background: colors.primary[500], color: '#FFF', borderRadius: 'var(--12, 96px)' }}
              >
                Hoàn tất
              </Button>
            </Box>
            <Box sx={{ width: '200px' }}>
              <Button
                variant='text'
                onClick={props.onBack}
                fullWidth
                sx={{ background: '#FFF', color: colors.primary[500] }}
              >
                Bỏ qua
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}
