import { useState, useEffect } from 'react'
import { Typography, Box, useTheme, IconButton, Link } from '@mui/material'
import { useBookingContext } from '~/contexts/BookingContext'
import RefreshIcon from '@mui/icons-material/Refresh'
import { useMutation } from '@tanstack/react-query'
import { generatePaymentUrl } from '~/apis/paymentApi'
import { QRCodeSVG } from 'qrcode.react'

const QRCodePayment = () => {
  const [timeLeft, setTimeLeft] = useState(15 * 60)
  const [showReload, setShowReload] = useState(false)
  const [paymentUrl, setPaymentUrl] = useState<string>('')
  const bookingContext = useBookingContext()
  const bookingData = bookingContext?.bookingData
  const theme = useTheme()

  useEffect(() => {
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
  }, [])

  const { mutate: createPaymentUrl } = useMutation({
    mutationFn: async (amount: number) => {
      const paymentRequest = {
        amount: amount,
        orderId: bookingData?.roomType?.id?.toString() || ''
      }
      return await generatePaymentUrl(paymentRequest)
    },
    onSuccess: (data) => {
      setPaymentUrl(data.url)
    },
    onError: (error) => {
      console.error('Error generating payment URL:', error)
    }
  })

  const handleReload = () => {
    const roomTotal = bookingData?.selectedRooms.reduce((total, room) => total + room.price, 0) || 0
    let amenitiesTotal = 0

    if (bookingData?.selectedRooms) {
      amenitiesTotal = bookingData?.selectedRooms.reduce(
        (total, room) => total + room.amenities.reduce((sum, amenity) => sum + amenity.price * amenity.quantity, 0),
        0
      )

      let discountAmount = 0
      if (bookingData?.servicePackage && bookingData.servicePackage.discountPercentage) {
        discountAmount = (roomTotal + amenitiesTotal) * (bookingData.servicePackage.discountPercentage / 100)
      }
      const grandTotal = roomTotal + amenitiesTotal - discountAmount
      createPaymentUrl(grandTotal)
      setTimeLeft(15 * 60)
      setShowReload(false)
    }
  }

  if (!bookingData) return null

  const roomTotal = bookingData.selectedRooms.reduce((total, room) => total + room.price, 0)
  const amenitiesTotal = bookingData.selectedRooms.reduce(
    (total, room) => total + room.amenities.reduce((sum, amenity) => sum + amenity.price * amenity.quantity, 0),
    0
  )

  let discountAmount = 0
  if (bookingData.servicePackage && bookingData.servicePackage.discountPercentage) {
    discountAmount = (roomTotal + amenitiesTotal) * (bookingData.servicePackage.discountPercentage / 100)
  }
  const grandTotal = roomTotal + amenitiesTotal - discountAmount

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
        {showReload ? (
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
      )}

      <Typography variant='subtitle1' color={theme.palette.primary.main} fontWeight='bold'>
        {grandTotal.toLocaleString()} VND
      </Typography>
    </Box>
  )
}

export default QRCodePayment
