import { Box } from '@mui/material'
import Grid from '@mui/material/Grid2'
import BookingDetails from '~/components/BookingDetails/BookingDetails'
import QRCodePayment from '~/components/QRCodePayment/QRCodePayment'
import SockJS from 'sockjs-client'
import { toast } from 'react-toastify'
import Stomp from 'stompjs'
import { useEffect } from 'react'
import { useBookingContext } from '~/contexts/BookingContext'
import envConfig from '~/constants/config'

export const PaymentDetail: React.FC = () => {
  const bookingContext = useBookingContext()
  const bookingData = bookingContext?.bookingData
  const socketCL = new SockJS(envConfig.VITE_SOCKET_URL)
  const client = Stomp.over(socketCL)

  useEffect(() => {
    client.connect({}, () => {
      client.subscribe('/topic/payments', (data) => {
        const roomId = JSON.parse(data.body)
        if (bookingData!.selectedRooms.some((room) => room.id == roomId.id)) {
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
    <Box sx={{ height: '100%', marginX: '104px' }}>
      <Box>
        <Grid container>
          <Grid size={{ xs: 12, lg: 6 }} sx={{ paddingRight: '12px' }}>
            <BookingDetails />
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }} sx={{ paddingLeft: '12px' }}>
            <Box>
              <QRCodePayment />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
