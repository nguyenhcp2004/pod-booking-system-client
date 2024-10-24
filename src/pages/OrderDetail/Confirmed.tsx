import { Avatar, Box, Button, Divider, Typography, useTheme, Backdrop, CircularProgress } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchTransactionInfo } from '~/apis/paymentApi'
import { useEffect, useState } from 'react'
import { useBookingContext } from '~/contexts/BookingContext'
import { createOrder } from '~/apis/orderApi'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import { Helmet } from 'react-helmet-async'
import { useGetMe } from '~/queries/useAccount'
import { calTotalPrice } from '~/utils/order'

export const Confirmed: React.FC = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const bookingContext = useBookingContext()
  const transactionData = location.state?.transactionData
  const { data: userData } = useGetMe()
  const [status, setStatus] = useState<boolean | null>(null)
  const [orderCreated, setOrderCreated] = useState(0)

  const { vnp_Amount, vnp_BankCode, vnp_OrderInfo, vnp_ResponseCode } = transactionData || {}

  const { isLoading } = useQuery({
    queryKey: ['transactionInfo', vnp_Amount, vnp_BankCode, vnp_OrderInfo, vnp_ResponseCode],
    queryFn: async () => {
      const response = await fetchTransactionInfo(vnp_Amount, vnp_BankCode, vnp_OrderInfo, vnp_ResponseCode)
      if (!response) throw new Error('No response from API')

      if (response.status === 'OK' && orderCreated === 0) {
        setOrderCreated(1)
        setStatus(true)
        if (!bookingContext) throw new Error('Booking context is undefined')

        await createOrder(bookingContext.bookingData)
        return response
      } else {
        setStatus(false)
        throw new Error(response.message || 'Transaction not successful')
      }
    },
    enabled: !!vnp_BankCode && !!vnp_ResponseCode
  })

  const socketCL = new SockJS('http://localhost:8080/ws')
  const client = Stomp.over(socketCL)

  useEffect(() => {
    client.connect({}, () => {
      const room = bookingContext!.bookingData.selectedRooms[0]
      const building = bookingContext!.bookingData.roomType?.building
      const payload = {
        id: room.id,
        name: room.name,
        buildingNumber: building?.id
      }
      client.send('/app/payments', {}, JSON.stringify(payload))
    })

    return () => {
      if (client.connected) {
        client.disconnect(() => {})
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingContext])

  const handleReturn = () => {
    localStorage.setItem('bookingData', JSON.stringify({}))
    navigate('/')
  }

  if (!transactionData) return <Box>No order data available.</Box>

  if (isLoading) {
    return (
      <Backdrop open>
        <CircularProgress />
      </Backdrop>
    )
  }

  const bookingData = bookingContext?.bookingData
  if (!bookingData) return null

  return (
    <Box sx={{ marginX: '104px' }}>
      <Helmet>
        <title>Xác nhận đặt phòng | POD System</title>
        <meta name='description' content='Xác nhận đặt phòng: Chi tiết đặt phòng của bạn' />
      </Helmet>
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
            <CheckCircleIcon
              sx={{ fontSize: 50, color: status ? theme.palette.success.main : theme.palette.error.main }}
            />
            <Typography variant='h3' fontWeight='bold' gutterBottom>
              {status ? 'Đặt phòng thành công' : 'Đặt phòng thất bại'}
            </Typography>

            <Box sx={{ my: '32px', textAlign: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='subtitle2' color={theme.palette.grey[500]}>
                    Tên khách hàng
                  </Typography>
                  <Typography variant='subtitle2' fontWeight='bold'>
                    {userData?.data?.data?.name}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='subtitle2' color={theme.palette.grey[500]}>
                    Tổng đơn
                  </Typography>
                  <Typography variant='subtitle2' fontWeight='bold'>
                    {calTotalPrice(bookingData).total.toLocaleString()} VND
                  </Typography>
                </Box>
                <Divider />
              </Box>
            </Box>

            <Box display='flex' gap='20px' alignItems='center' sx={{ p: '20px' }}>
              <Avatar
                src={bookingData.selectedRooms[0].image}
                alt={bookingData.roomType?.name}
                sx={{ width: '200px', height: '193px', borderRadius: '16px' }}
                variant='rounded'
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '193px' }}>
                <Typography variant='h5' fontWeight='bold'>
                  {bookingData.roomType?.name}
                </Typography>
                <Box display='flex' sx={{ mt: '4px' }}>
                  <Typography variant='subtitle2' color={theme.palette.primary.main}>
                    {bookingData.roomType?.price.toLocaleString()} VND
                  </Typography>
                  <Typography variant='subtitle2'>/tiếng</Typography>
                </Box>
                <Box
                  sx={{
                    mt: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    alignItems: 'flex-start'
                  }}
                >
                  <Typography variant='body2'>
                    <b>Địa chỉ:</b> {bookingData.roomType?.building?.address}
                  </Typography>
                  <Typography variant='body2'>
                    <b>Ngày:</b> {bookingData.date}
                  </Typography>
                  <Typography variant='body2'>
                    <b>Slot:</b> {bookingData.timeSlots}
                  </Typography>
                  <Typography variant='body2'>
                    <b>Phòng:</b> {bookingData.selectedRooms.map((room) => room.name).join(', ')}
                  </Typography>
                  <Typography variant='body2'>
                    <b>Gói:</b> {bookingData.servicePackage?.name}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box display='flex' justifyContent='flex-end' gap='10px' sx={{ mr: '38px' }}>
          {/* <Button variant='outlined'>Hủy đơn hàng</Button> */}
          <Button variant='contained' onClick={handleReturn}>
            Trở về trang chủ
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
