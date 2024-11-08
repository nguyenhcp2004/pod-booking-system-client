import { Box, Button, useTheme } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useContext, useEffect } from 'react'
import { tokens } from '~/themes/theme'
import BookingDetails from '~/components/BookingDetails/BookingDetails'
import { toast } from 'react-toastify'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import { Helmet } from 'react-helmet-async'
import AddAmenityOrder from '~/components/AminManageOrder/CreateOrderComponents/AddAmenityOrder'
import { BookingContext } from '~/contexts/BookingContext'
import envConfig from '~/constants/config'

interface CommonProps {
  onNext: () => void
  onBack: () => void
}

export const Amenities: React.FC<CommonProps> = (props) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const bookingContext = useContext(BookingContext)
  if (!bookingContext) {
    throw new Error('BookingContext must be used within a BookingProvider')
  }
  const { bookingData, setBookingData } = bookingContext

  const socketCL = new SockJS(envConfig.VITE_SOCKET_URL)
  const client = Stomp.over(socketCL)

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
  }, [bookingData])

  return (
    <Box sx={{ marginX: '104px' }}>
      <Helmet>
        <title>Đặt dịch vụ | POD System</title>
        <meta
          name='description'
          content='Đặt thêm dịch vụ: Nâng cao trải nghiệm phòng với đồ ăn, bàn ghế và hơn thế nữa'
        />
      </Helmet>
      <Grid container spacing={2}>
        <Grid size={{ lg: 6 }} sx={{ padding: '0px !important' }}>
          <AddAmenityOrder bookingData={bookingData} setBookingData={setBookingData} />
        </Grid>

        <Grid size={{ lg: 6 }} sx={{ paddingLeft: '12px' }}>
          <Box sx={{ background: '#FFF' }}>
            <Box>
              <BookingDetails />
            </Box>
            <Box sx={{ width: '100%', padding: '20px' }}>
              <Button
                onClick={props.onNext}
                fullWidth
                sx={{
                  background: colors.primary[500],
                  color: '#FFF',
                  borderRadius: 'var(--12, 96px)'
                }}
              >
                {bookingData?.selectedRooms?.filter((room) => room.amenities.length > 0).length > 0
                  ? 'Hoàn tất'
                  : 'Bỏ qua'}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
