import { useState, useEffect } from 'react'
import { Typography, Box, useTheme, IconButton, Link, FormControlLabel, Checkbox, Button } from '@mui/material'
import { useBookingContext } from '~/contexts/BookingContext'
import RefreshIcon from '@mui/icons-material/Refresh'
import { useMutation } from '@tanstack/react-query'
import { generatePaymentUrl } from '~/apis/paymentApi'
import { QRCodeSVG } from 'qrcode.react'

import { Helmet } from 'react-helmet-async'
import { calTotalPrice } from '~/utils/order'
import { formatCurrency } from '~/utils/currency'
import { useAppContext } from '~/contexts/AppProvider'
import { useNavigate } from 'react-router-dom'

const QRCodePayment = () => {
  const [timeLeft, setTimeLeft] = useState(15 * 60)
  const [showReload, setShowReload] = useState(false)
  const [paymentUrl, setPaymentUrl] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [useBalance, setUseBalance] = useState(false)
  const bookingContext = useBookingContext()
  const bookingData = bookingContext?.bookingData
  const { account: account } = useAppContext()
  const theme = useTheme()
  const navigate = useNavigate()

  const { mutate: createPaymentUrl } = useMutation({
    mutationFn: async (amount: number) => {
      const paymentRequest = {
        amount: amount,
        orderId: bookingData?.roomType?.id?.toString() || '',
        returnUrl: import.meta.env.VITE_VNPAY_RETURN_URL as string
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

  const totalAmount = calTotalPrice(bookingData).total
  const payableAmount = useBalance ? Math.max(totalAmount - (account?.balance || 0), 0) : totalAmount

  useEffect(() => {
    setLoading(true)
    if (bookingData && payableAmount >= 1000) {
      createPaymentUrl(payableAmount)
    }

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
  }, [bookingData, createPaymentUrl, payableAmount, useBalance])

  if (!bookingData) return null

  const handleReload = () => {
    setLoading(true)
    createPaymentUrl(payableAmount)
    setTimeLeft(15 * 60)
    setShowReload(false)
  }

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUseBalance(event.target.checked)
  }

  const transactionData = {
    vnp_Amount: Math.round(payableAmount).toString().slice(0, -2),
    vnp_BankCode: 'VNPay',
    vnp_OrderInfo: 'Thanh toán đơn hàng',
    vnp_ResponseCode: '00'
  }

  const handleConfirmPayment = () => {
    navigate('/order-detail/4', { state: { transactionData } })
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
  }

  return (
    <Box>
      <Box sx={{ bgcolor: 'white', marginBottom: '20px', padding: 2 }}>
        <Typography>
          Số tiền hiện tại trong ví của bạn: {account?.balance ? formatCurrency(Math.round(account.balance)) : '0 VND'}
        </Typography>
        <FormControlLabel
          control={<Checkbox checked={useBalance} onChange={handleCheckboxChange} />}
          label='Sử dụng số dư trong ví để thanh toán'
        />
      </Box>
      <Box
        sx={{
          padding: 2,
          paddingY: 5,
          textAlign: 'center',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '20px',
          bgcolor: 'white'
        }}
      >
        <Helmet>
          <title>Thanh toán | POD System</title>
          <meta name='description' content='Thanh toán đặt phòng: Hoàn tất giao dịch của bạn' />
        </Helmet>
        <Typography variant='h5' gutterBottom>
          Thanh toán bằng QR Code
        </Typography>

        {payableAmount > 0 ? (
          payableAmount >= 10000 ? (
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
          ) : (
            <Box>
              <Typography variant='body2' color='error'>
                Số tiền thanh toán nhỏ hơn 10,000 VND. Không thể tạo mã QR.
              </Typography>
              {useBalance ? (
                <Button variant='contained' color='primary' onClick={handleConfirmPayment}>
                  Xác nhận thanh toán bằng balance
                </Button>
              ) : (
                <Button variant='contained' color='primary'>
                  Liên hệ staff được hỗ trợ
                </Button>
              )}
            </Box>
          )
        ) : (
          <Button variant='contained' color='primary' onClick={handleConfirmPayment}>
            Xác nhận thanh toán bằng balance
          </Button>
        )}

        {showReload ? (
          <Typography variant='subtitle2'>Mã QR đã hết hạn. Nhấn vào biểu tượng để làm mới.</Typography>
        ) : (
          !loading && (
            <Box>
              {payableAmount > 0 ? (
                <>
                  <Link href={paymentUrl} rel='noopener' color={theme.palette.primary.main} sx={{ fontSize: '16px' }}>
                    Thanh toán ngay
                  </Link>
                  <Typography variant='body2' sx={{ marginTop: '20px', color: theme.palette.grey[500] }}>
                    Mã QR hết hạn sau: {formatTime(timeLeft)}
                  </Typography>
                </>
              ) : (
                <Button variant='contained' onClick={handleConfirmPayment}>
                  Xác nhận thanh toán bằng balance
                </Button>
              )}
            </Box>
          )
        )}
        <Typography variant='subtitle1' color={theme.palette.primary.main} fontWeight='bold'>
          {formatCurrency(payableAmount)}
        </Typography>
      </Box>
    </Box>
  )
}

export default QRCodePayment
