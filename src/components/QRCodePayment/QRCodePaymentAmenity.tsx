import { useState, useEffect } from 'react'
import { Typography, Box, useTheme, IconButton, Link } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import { useMutation } from '@tanstack/react-query'
import { generatePaymentUrl } from '~/apis/paymentApi'
import { QRCodeSVG } from 'qrcode.react'
import { Helmet } from 'react-helmet-async'
import { useBookingAmenityContext } from '~/contexts/BookingAmenityContext'

const QRCodePaymentAmenity = () => {
  const [timeLeft, setTimeLeft] = useState(15 * 60)
  const [showReload, setShowReload] = useState(false)
  const [paymentUrl, setPaymentUrl] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const { bookedRoom, calculateTotal } = useBookingAmenityContext()
  const theme = useTheme()

  const total = calculateTotal() * 1000

  const { mutate: createPaymentUrl } = useMutation({
    mutationFn: async (amount: number) => {
      const paymentRequest = {
        amount: amount,
        orderId: bookedRoom?.orderId.toString() || '',
        returnUrl: import.meta.env.VITE_VNPAY_RETURN_URL_AMENITY as string
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
    createPaymentUrl(total)

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
  }, [total, createPaymentUrl])

  const handleReload = () => {
    setLoading(true)
    createPaymentUrl(total)
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
      <Helmet>
        <title>Thanh toán | POD System</title>
        <meta name='description' content='Thanh toán đặt phòng: Hoàn tất giao dịch của bạn' />
      </Helmet>
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
              href={paymentUrl}
              target='_blank'
              rel='noopener'
              color={theme.palette.primary.main}
              sx={{ fontSize: '16px' }}
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
        {total.toLocaleString()} VND
      </Typography>
    </Box>
  )
}

export default QRCodePaymentAmenity
