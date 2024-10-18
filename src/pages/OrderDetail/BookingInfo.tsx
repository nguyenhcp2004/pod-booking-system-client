import { Box, Button, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import BookingDetails from '~/components/BookingDetails/BookingDetails'
import { tokens } from '~/themes/theme'
import moment, { Moment } from 'moment'
import Calendar from '~/components/Calendar/Calendar'
import { useEffect, useState } from 'react'
import { slotType, useBookingContext } from '~/contexts/BookingContext'
import { toast } from 'react-toastify'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

//import { array } from 'zod'
interface CommonProps {
  onNext: () => void
  onBack: () => void
}

export const BookingInfo: React.FC<CommonProps> = (props) => {
  const colors = tokens('light')
  const bookingContext = useBookingContext()
  const [selectedDates, setSelectedDates] = useState<Moment[]>([])
  const [selectedSlots, setSelectedSlots] = useState<slotType[]>([])
  const bookingData = bookingContext!.bookingData
  const socketCL = new SockJS('http://localhost:8080/ws')
  const client = Stomp.over(socketCL)
  useEffect(() => {
    if (bookingData) {
      setSelectedDates([moment(bookingData.date)])
      setSelectedSlots(bookingData.timeSlots)
    }
  }, [bookingData])

  useEffect(() => {
    client.connect({}, () => {
      client.subscribe('/topic/payments', (data) => {
        const roomId = JSON.parse(data.body)
        if (bookingData.selectedRooms.some((room) => room.id == roomId.id)) {
          toast.success(`Phòng ${roomId.name} vừa được đặt`)
        }
      })
    })

    return () => {
      if (client.connected) {
        client.disconnect(() => {})
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingData]) // Không nên thêm client vào dependency này vì thằng stomp nó vào đây lại tạo lại 1 client mới
  // Dẫn đến thông báo 2 lần
  // Đồng thời thì thằng stompjs nó khó chịu là vào mỗi page thì mình sẽ phải tạo 1 socket mới luôn, tức dù mình navigate nó cũng disconnect
  if (!bookingData) return null

  return (
    <Box id='hehe' sx={{ height: '100%', marginX: '104px' }}>
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
            <Box sx={{ width: '100%' }}>
              <Button
                onClick={props.onNext}
                fullWidth
                sx={{ background: colors.primary[500], color: '#FFF', borderRadius: 'var(--12, 96px)' }}
              >
                Đặt phòng
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}
