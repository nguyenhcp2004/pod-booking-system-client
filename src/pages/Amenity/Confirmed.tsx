import { Avatar, Box, Button, Divider, Typography, useTheme, Backdrop, CircularProgress, Paper } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchTransactionInfo } from '~/apis/paymentApi'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useBookingAmenityContext } from '~/contexts/BookingAmenityContext'
import { useCreateOrderDetailAmenityMutation } from '~/queries/useOrderDetailAmenity'
import { formatDate, formatStartEndTime } from '~/utils/utils'
import { AccountType } from '~/schemaValidations/auth.schema'
import { useSendMailOrderAmenityMutation } from '~/queries/useAccount'
import { useAppContext } from '~/contexts/AppProvider'
import { toast } from 'react-toastify'

export const Confirmed: React.FC = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const sendMail = useSendMailOrderAmenityMutation()
  const { account: user } = useAppContext()
  const { selectedAmenities, bookedRoom, setBookedRoom, clearAmenities } = useBookingAmenityContext()
  const createOrderDetailAmenityMutation = useCreateOrderDetailAmenityMutation()

  const [status, setStatus] = useState<boolean | null>(null)
  const [orderCreated, setOrderCreated] = useState(0)

  const transactionData = location.state?.transactionData
  const { vnp_Amount, vnp_BankCode, vnp_OrderInfo, vnp_ResponseCode } = transactionData || {}

  const { isLoading } = useQuery({
    queryKey: ['transactionInfo', vnp_Amount, vnp_BankCode, vnp_OrderInfo, vnp_ResponseCode],
    queryFn: async () => {
      const transactionResponse = await fetchTransactionInfo(vnp_Amount, vnp_BankCode, vnp_OrderInfo, vnp_ResponseCode)
      if (!transactionResponse) {
        throw new Error('No response from API')
      }

      if (transactionResponse.status === 'OK' && orderCreated === 0) {
        setOrderCreated(orderCreated + 1)
        setStatus(true)
        toast.success('Hệ thống vừa gửi hóa đơn cho bạn!')
        // Create order detail amenities
        for (const amenity of selectedAmenities) {
          await createOrderDetailAmenityMutation.mutateAsync({
            orderDetailId: bookedRoom?.orderDetailId as string,
            amenityId: amenity.id,
            quantity: amenity.quantity,
            price: amenity.price
          })
        }
        await sendMail.mutateAsync({
          email: user?.email as string,
          orderDetailId: bookedRoom?.orderDetailId as string
        })

        return transactionResponse
      } else {
        if (orderCreated === 1) {
          setStatus(false)
        }
        throw new Error(transactionResponse.message || 'Transaction not successful')
      }
    },
    enabled: !!vnp_BankCode && !!vnp_ResponseCode
  })

  const handleReturn = () => {
    console.log('Back to homepage')
    setBookedRoom(null)
    localStorage.removeItem('bookingAmenities')
    localStorage.removeItem('bookedRoom')
    clearAmenities()
    navigate('/')
  }
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
  if (!transactionData || !bookedRoom) {
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
        <Typography variant='h5'>No booking data available</Typography>
        <Button variant='contained' onClick={handleReturn}>
          Trở về trang chủ
        </Button>
      </Paper>
    )
  }

  const amenitiesTotal = Math.round(
    selectedAmenities.reduce((total, amenity) => total + amenity.price * amenity.quantity, 0)
  )
  const discount = Math.round((bookedRoom.servicePackage.discountPercentage * amenitiesTotal) / 100)

  const accountString = localStorage.getItem('account')
  const account: AccountType = accountString ? JSON.parse(accountString) : null

  const bookingInfo = {
    orderDetailId: bookedRoom.orderDetailId,
    customerName: account.name,
    totalPrice: amenitiesTotal - discount,
    roomType: bookedRoom.roomType.name,
    pricePerHour: bookedRoom.roomType.price,
    address: bookedRoom.roomType.building.address,
    date: formatDate(bookedRoom.startTime),
    timeSlots: formatStartEndTime(bookedRoom.startTime, bookedRoom.endTime),
    amenities: selectedAmenities.map((amenity) => amenity.name).join(', '),
    package: bookedRoom.servicePackage.name,
    imageSrc: bookedRoom.image
  }

  return (
    <Box sx={{ marginX: '104px' }}>
      <Helmet>
        <title>Xác nhận đặt dịch vụ | POD System</title>
        <meta name='description' content='Xác nhận đặt dịch vụ: Chi tiết đặt phòng của bạn' />
      </Helmet>
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
                    Đặt dịch vụ thành công
                  </Typography>
                </Box>
              ) : (
                <Box textAlign='center'>
                  <CheckCircleIcon sx={{ fontSize: 50, color: theme.palette.error.main }} />
                  <Typography variant='h3' fontWeight='bold' gutterBottom>
                    Đặt dịch vụ thất bại
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
                      {bookingInfo.orderDetailId}
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
                        dịch vụ:
                      </Typography>
                      <Typography variant='body2'>{bookingInfo.amenities}</Typography>
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
            <Button variant='contained' onClick={handleReturn}>
              Back to homepage
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
