import { Box, Button, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { tokens } from '~/themes/theme'
import moment, { Moment } from 'moment'
import Calendar from '~/components/Calendar/Calendar'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useBookingAmenityContext } from '~/contexts/BookingAmenityContext'
import { formatTime } from '~/utils/utils'
import BookingAmenityDetails from '~/components/BookingDetails/BookingAmenityDetails'

//import { array } from 'zod'
interface CommonProps {
  onNext: () => void
  onBack: () => void
}

export const BookingAmenityInfo: React.FC<CommonProps> = (props) => {
  const colors = tokens('light')
  const { bookedRoom } = useBookingAmenityContext()
  const [selectedDates, setSelectedDates] = useState<Moment[]>([])
  const [selectedSlots, setSelectedSlots] = useState<string[]>([])

  useEffect(() => {
    if (bookedRoom) {
      const startDate = moment(bookedRoom.startTime)
      setSelectedDates([startDate])
      setSelectedSlots([`${formatTime(bookedRoom.startTime)} - ${formatTime(bookedRoom.endTime)}`])
    }
  }, [bookedRoom])

  return (
    <Box id='hehe' sx={{ height: '100%', marginX: '104px' }}>
      <Helmet>
        <title>Thông tin đặt phòng | POD System</title>
        <meta name='description' content='Chi tiết đặt phòng: Tìm phòng phù hợp với lịch trình của bạn' />
      </Helmet>
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
                    <Calendar selected={selectedDates} slots={selectedSlots} />
                  </Grid>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }} sx={{ paddingLeft: '0px !important', paddingTop: '0px !important' }}>
          <Box>
            <BookingAmenityDetails />
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
            <Box sx={{ width: '100%' }}>
              <Button
                onClick={props.onNext}
                fullWidth
                sx={{ background: colors.primary[500], color: '#FFF', borderRadius: 'var(--12, 96px)' }}
              >
                Đặt tiện ích
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}
