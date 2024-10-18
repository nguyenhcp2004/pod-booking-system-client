import { Box, IconButton, Typography, useTheme } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { generatePaymentUrl } from '~/apis/paymentApi'
import RefreshIcon from '@mui/icons-material/Refresh'
import { QRCodeSVG } from 'qrcode.react'
import { Link } from 'react-router-dom'
import { BookingInfo } from '~/contexts/BookingContext'

interface PaymentBoxProps {
  bookingData: BookingInfo
}

const PaymentBox = ({ bookingData }: PaymentBoxProps) => {
  const [timeLeft, setTimeLeft] = useState(15 * 60)
  const [showReload, setShowReload] = useState(false)
  const [paymentUrl, setPaymentUrl] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const theme = useTheme()
  const roomTotal = Math.round(
    bookingData?.roomType?.price ? bookingData.roomType.price * bookingData?.selectedRooms?.length : 0
  )

  const amenitiesTotal = Math.round(
    bookingData?.selectedRooms?.reduce(
      (total, room) => total + room.amenities.reduce((sum, amenity) => sum + amenity.price * amenity.quantity, 0),
      0
    ) || 0
  )

  let discountAmount = 0
  if (bookingData?.servicePackage?.discountPercentage) {
    discountAmount = Math.round((bookingData.servicePackage.discountPercentage * (roomTotal + amenitiesTotal)) / 100)
  }
  const total = roomTotal + amenitiesTotal - discountAmount
  const grandTotal = Math.floor(total)

  const { mutate: createPaymentUrl } = useMutation({
    mutationFn: async (amount: number) => {
      const paymentRequest = {
        amount: amount,
        orderId: bookingData?.roomType?.id?.toString() || '',
        returnUrl: import.meta.env.VITE_VNPAY_RETURN_ADMIN_URL as string
      }
      return await generatePaymentUrl(paymentRequest)
    },
    onSuccess: (data) => {
      setPaymentUrl(data.url)
      setLoading(false)
    },
    onError: (error) => {
      console.error('Error generating payment URL:', error)
      setLoading(false)
    }
  })

  useEffect(() => {
    setLoading(true)
    createPaymentUrl(grandTotal)

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          setShowReload(true)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [grandTotal, createPaymentUrl])

  const handleReload = () => {
    setLoading(true)
    createPaymentUrl(grandTotal)
    setTimeLeft(15 * 60)
    setShowReload(false)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
  }

  return (
    <Box
      sx={{
        bgcolor: 'white',
        padding: 2,
        paddingY: 7,
        textAlign: 'center',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px'
      }}
    >
      <Typography variant='h5' gutterBottom>
        Thanh toán bằng QR Code
      </Typography>

      <Box sx={{ width: '240px', height: '240px', border: '1px solid black' }}>
        {loading ? (
          <Typography variant='body2'>Đang tải mã QR...</Typography>
        ) : showReload ? (
          <IconButton onClick={handleReload}>
            <RefreshIcon fontSize='large' />
          </IconButton>
        ) : (
          <QRCodeSVG value={paymentUrl} size={240} />
        )}
      </Box>

      {showReload ? (
        <Typography variant='subtitle2'>Mã QR đã hết hạn. Nhấn vào biểu tượng để làm mới.</Typography>
      ) : (
        !loading && (
          <Box>
            <Link
              to={paymentUrl}
              target='_blank'
              rel='noopener'
              style={{ color: theme.palette.primary.main, fontSize: '16px' }}
            >
              Thanh toán ngay
            </Link>
            <Typography variant='body2' sx={{ marginTop: '20px', color: theme.palette.grey[500] }}>
              Mã QR hết hạn sau: {formatTime(timeLeft)}
            </Typography>
          </Box>
        )
      )}

      <Typography variant='subtitle1' color={theme.palette.primary.main} fontWeight='bold'>
        {grandTotal.toLocaleString()} VND
      </Typography>
    </Box>
  )
}

export default PaymentBox
