import { Avatar, Box, Button, Divider, Typography, useTheme, Backdrop, CircularProgress, Paper } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchTransactionInfo } from '~/apis/paymentApi'
import { useEffect, useState } from 'react'
import { useBookingContext } from '~/contexts/BookingContext'
import { createOrder } from '~/apis/orderApi'
import { client } from '~/utils/socket'

export const Confirmed: React.FC = () => {
  const handleReturn = () => {
    console.log('Back to homepage')
    localStorage.setItem('bookingData', JSON.stringify({}))
    navigate('/')
  }
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const transactionData = location.state?.transactionData
  const [status, setStatus] = useState<boolean | null>(null)
  const bookingContext = useBookingContext()
  console.log(bookingContext)
  const { vnp_Amount, vnp_BankCode, vnp_OrderInfo, vnp_ResponseCode } = transactionData || {}

  const { isLoading } = useQuery({
    queryKey: ['transactionInfo', vnp_Amount, vnp_BankCode, vnp_OrderInfo, vnp_ResponseCode],
    queryFn: async () => {
      const transactionResponse = await fetchTransactionInfo(vnp_Amount, vnp_BankCode, vnp_OrderInfo, vnp_ResponseCode)
      if (!transactionResponse) {
        throw new Error('No response from API')
      }

      if (transactionResponse.status === 'OK') {
        setStatus(true)
        if (!bookingContext) {
          throw new Error('Booking context is undefined')
        }
        const response = await createOrder(bookingContext.bookingData)
        console.log('Response request:', response)

        return transactionResponse
      } else {
        setStatus(false)
        throw new Error(transactionResponse.message || 'Transaction not successful')
      }
    },
    enabled: !!vnp_BankCode && !!vnp_ResponseCode
  })

  useEffect(() => {
    client.connect({}, () => {
      const roomId = bookingContext?.bookingData.selectedRooms[0].id
      const payload = {
        id: roomId
      }
      client.send('/app/payments', {}, JSON.stringify(payload))
    })

    return () => {
      if (client.connected) {
        client.disconnect(() => {})
      }
    }
  }, [bookingContext?.bookingData.selectedRooms])

  if (!transactionData) {
    return <Box>No order data available.</Box>
  }

  if (isLoading) {
    return (
      <Backdrop open>
        <CircularProgress />
      </Backdrop>
    )
  }
  if (status === null) {
    return (
      <Paper
        sx={{
          marginX: '104px',
          height: '70vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          gap: '50px'
        }}
      >
        <Typography variant='h5'>You need create an order</Typography>
        <Button variant='contained' onClick={handleReturn}>
          Back to homepage
        </Button>
      </Paper>
    )
  }

  const bookingData = bookingContext?.bookingData

  if (!bookingData) return null

  const roomTotal = Math.round(
    bookingData?.roomType?.price ? bookingData.roomType.price * bookingData?.selectedRooms?.length : 0
  )

  const amenitiesTotal = Math.round(
    bookingData?.selectedRooms?.reduce(
      (total, room) => total + room.amenities.reduce((sum, amenity) => sum + amenity.price * amenity.quantity, 0),
      0
    ) || 0
  )

  let discount = 0
  if (bookingData?.servicePackage?.discountPercentage) {
    discount = Math.round((bookingData.servicePackage.discountPercentage * (roomTotal + amenitiesTotal)) / 100)
  }

  const bookingInfo = {
    orderId: '#ABCXYZ',
    customerName: 'Phạm Thị Anh Đào',
    totalPrice: roomTotal + amenitiesTotal - discount,
    roomType: bookingData.roomType?.name || '',
    pricePerHour: bookingData.roomType?.price || 0,
    address: bookingData.roomType?.building?.address || '',
    date: bookingData.date || '',
    timeSlots: bookingData.timeSlots.join(', '),
    rooms: bookingData.selectedRooms.map((room) => room.name),
    package: bookingData.servicePackage?.name || '',
    imageSrc: 'https://i.pinimg.com/736x/1a/ea/75/1aea75b50d0a133a83e550757b993db7.jpg'
  }

  return (
    <Box sx={{ marginX: '104px' }}>
      <Box>
        <Box
          sx={{
            bgcolor: 'white',
            width: '100%',
            mx: 'auto',
            minHeight: '70vh',
            paddingTop: '108px',
            paddingBottom: '38px'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', paddingBottom: '70px' }}>
            <Box sx={{ width: '40%' }}>
              {status ? (
                <Box textAlign='center'>
                  <CheckCircleIcon sx={{ fontSize: 50, color: theme.palette.success.main }} />
                  <Typography variant='h3' fontWeight='bold' gutterBottom>
                    Đặt phòng thành công
                  </Typography>
                </Box>
              ) : (
                <Box textAlign='center'>
                  <CheckCircleIcon sx={{ fontSize: 50, color: theme.palette.error.main }} />
                  <Typography variant='h3' fontWeight='bold' gutterBottom>
                    Đặt phòng thất bại
                  </Typography>
                </Box>
              )}

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
            </Box>
          </Box>
          <Box display='flex' justifyContent='flex-end' gap='10px' sx={{ marginRight: '38px' }}>
            <Button variant='outlined'>Add amenities</Button>
            <Button variant='outlined'>Cancel booking</Button>
            <Button variant='contained' onClick={handleReturn}>
              Back to homepage
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
