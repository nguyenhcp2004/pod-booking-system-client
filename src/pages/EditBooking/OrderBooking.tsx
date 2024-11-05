import { Avatar, Box, Button, Divider, InputLabel, MenuItem, Select, useTheme } from '@mui/material'
import moment from 'moment'
import { getDayBefore, getHour, getMonthNumber, handleErrorApi } from '~/utils/utils'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { CanceledReason } from '~/constants/type'
import { GetOrderInfoResType } from '~/schemaValidations/order.schema'
import { formatCurrency } from '~/utils/currency'
import { DEFAULT_DATE_FORMAT } from '~/utils/timeUtils'
import { toast } from 'react-toastify'
import { useUpdateOrderStatusMutation } from '~/queries/useOrder'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useSendMailOrderMutation } from '~/queries/useAccount'
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(3)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(2)
  }
}))
export default function OrderBooking({ orderDetail }: { orderDetail: GetOrderInfoResType['data'] }) {
  const theme = useTheme()
  const navigate = useNavigate()
  const roomHaveAmenities = orderDetail.orderDetails.filter((od) => od.amenities.length > 0)
  const [open, setOpen] = useState(false)
  const [openConfirm, setOpenConfirm] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [error, setError] = useState('')
  const updateOrderMutation = useUpdateOrderStatusMutation()
  const sendMailMutation = useSendMailOrderMutation()
  const queryClient = useQueryClient()
  const totalPriceRoom = orderDetail.orderDetails.reduce((total, orderDetail) => {
    return total + orderDetail.roomPrice
  }, 0)
  const totalPriceAmenity = orderDetail.orderDetails.reduce((total, orderDetail) => {
    return (
      total +
      orderDetail.amenities.reduce((totalAmenity, amenity) => {
        return totalAmenity + amenity.price * amenity.quantity
      }, 0)
    )
  }, 0)
  const priceBeforeDiscount = totalPriceRoom + totalPriceAmenity
  const finalPrice =
    priceBeforeDiscount * (1 - (orderDetail.orderDetails[0].servicePackage.discountPercentage ?? 0) / 100)

  const handleClickOpen = () => {
    const startTime = moment(orderDetail.orderDetails[0].startTime)
    const today = moment()

    if (!today.isBefore(startTime.clone().subtract(1, 'days')) || orderDetail.orderDetails[0].servicePackage.id === 4) {
      toast.error('Bạn không thể hủy đơn này')
      return
    }
    setOpen(true)
  }

  const handleClickOpenConfirm = () => {
    setOpenConfirm(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const handleCloseConfirm = () => {
    setOpenConfirm(false)
  }

  const handleConfirm = async () => {
    if (!cancelReason) {
      setError('Vui lòng chọn lý do hủy phòng')
    } else {
      setError('')
      setOpen(false)
      handleClickOpenConfirm()
    }
  }

  const handleCancel = async () => {
    if (updateOrderMutation.isPending) return
    try {
      await updateOrderMutation.mutateAsync({
        id: orderDetail.id,
        status: 'Rejected',
        cancelReason
      })
      toast.success('Đã hủy phòng thành công')
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['order-of-account'] }),
        sendMailMutation.mutateAsync({ email: orderDetail.orderDetails[0].customer.email, orderId: orderDetail.id })
      ])

      navigate('/history-orders')
    } catch (error) {
      handleErrorApi({ error })
    }
  }

  return (
    <>
      {orderDetail && (
        <Box sx={{ bgcolor: 'white', borderRadius: 2, boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)' }}>
          <Box sx={{ padding: '20px' }}>
            <Typography variant='h5' color={theme.palette.primary.main} gutterBottom fontWeight='bold'>
              Đơn đặt
            </Typography>
            <Box display='flex' alignItems='center' sx={{ marginTop: '24px' }} gap='20px'>
              <Avatar
                src={orderDetail.orderDetails[0].roomImage}
                alt={orderDetail.orderDetails[0].roomTypeName}
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
              >
                <Typography variant='h5' fontWeight='bold'>
                  {orderDetail.orderDetails[0].roomTypeName}
                </Typography>
                <Box display='flex' sx={{ marginTop: '4px' }}>
                  <Typography variant='subtitle2' color={theme.palette.primary.main}>
                    {formatCurrency(orderDetail.orderDetails[0].roomPrice)}
                  </Typography>
                  <Typography variant='subtitle2'>/tiếng</Typography>
                </Box>
                <Box sx={{ marginTop: '12px' }} flexDirection='column' display='flex' gap='12px'>
                  <Box display='flex' gap='3px'>
                    <Typography variant='body2' fontWeight='bold'>
                      Địa chỉ:
                    </Typography>
                    <Typography variant='body2'>{orderDetail.orderDetails[0].buildingAddress}</Typography>
                  </Box>
                  <Box display='flex' gap='3px'>
                    <Typography variant='body2' fontWeight='bold'>
                      Ngày:
                    </Typography>
                    <Typography variant='body2'>
                      {moment(orderDetail.orderDetails[0].startTime).format(DEFAULT_DATE_FORMAT)}
                    </Typography>
                  </Box>
                  <Box display='flex' gap='3px'>
                    <Typography variant='body2' fontWeight='bold'>
                      Slot:
                    </Typography>
                    <Typography variant='body2'>
                      {getHour(orderDetail.orderDetails[0].startTime)}:00 -{' '}
                      {getHour(orderDetail.orderDetails[0].endTime)}:00
                    </Typography>
                  </Box>
                  <Box display='flex' gap='3px'>
                    <Typography variant='body2' fontWeight='bold'>
                      Gói dịch vụ:
                    </Typography>
                    <Typography variant='body2'>{orderDetail.orderDetails[0].servicePackage.name}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box sx={{ paddingY: '20px' }}>
              {roomHaveAmenities.length > 0 && (
                <Typography variant='subtitle1' gutterBottom color={theme.palette.primary.main}>
                  Dịch vụ bạn đã chọn
                </Typography>
              )}
              {roomHaveAmenities.map((room, index) => {
                return (
                  <Box key={index}>
                    <Typography variant='subtitle2'>{room.roomName}</Typography>
                    <Box sx={{ width: '100%' }}>
                      {room.amenities.map((amenity) => (
                        <Box
                          key={amenity.id}
                          display='flex'
                          justifyContent='space-between'
                          alignItems='center'
                          sx={{ marginTop: '20px' }}
                        >
                          <Typography variant='subtitle2' color={theme.palette.grey[500]} sx={{ flex: 1 }}>
                            {amenity.name}
                          </Typography>
                          <Typography
                            variant='subtitle2'
                            color={theme.palette.grey[500]}
                            sx={{ flex: 1 }}
                            textAlign='center'
                          >
                            {amenity.quantity}
                          </Typography>
                          <Box sx={{ flex: 1 }} display='flex' justifyContent='flex-end' gap='5px'>
                            <Typography variant='subtitle2' fontWeight='bold'>
                              {formatCurrency(amenity.price)}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )
              })}
            </Box>
          </Box>
          <Divider />
          <Box sx={{ padding: '20px' }} display='flex' flexDirection='column' gap='20px'>
            <Box display='flex' justifyContent='space-between'>
              <Typography variant='subtitle2' color={theme.palette.grey[500]}>
                Tổng giá phòng:
              </Typography>
              <Typography variant='subtitle2' fontWeight='bold'>
                {formatCurrency(totalPriceRoom)}
              </Typography>
            </Box>
            <Box display='flex' justifyContent='space-between'>
              <Typography variant='subtitle2' color={theme.palette.grey[500]}>
                Tổng các dịch vụ:
              </Typography>
              <Typography variant='subtitle2' fontWeight='bold'>
                {formatCurrency(totalPriceAmenity)}
              </Typography>
            </Box>
            <Box display='flex' justifyContent='space-between'>
              <Typography variant='subtitle2' color={theme.palette.grey[500]}>
                Giảm giá: (gói {orderDetail.orderDetails[0].servicePackage.name}{' '}
                {orderDetail.orderDetails[0].servicePackage.discountPercentage}%)
              </Typography>
              <Typography variant='subtitle2' fontWeight='bold'>
                {formatCurrency(
                  (orderDetail.orderDetails[0].servicePackage.discountPercentage / 100) * priceBeforeDiscount
                )}
              </Typography>
            </Box>
          </Box>
          <Divider />
          <Box sx={{ padding: '20px' }} display='flex' justifyContent='space-between'>
            <Typography variant='subtitle2' color={theme.palette.grey[500]}>
              Tổng đơn:
            </Typography>
            <Typography variant='subtitle2' fontWeight='bold'>
              {formatCurrency(finalPrice)}
            </Typography>
          </Box>
          <Box sx={{ width: '100%', padding: '20px' }}>
            <Button onClick={handleClickOpen} fullWidth variant='outlined'>
              Hủy đặt phòng
            </Button>
            <BootstrapDialog onClose={handleClose} aria-labelledby='customized-dialog-title' open={open}>
              <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold', fontSize: '1.5rem' }} id='customized-dialog-title'>
                Hủy đặt phòng
              </DialogTitle>
              <IconButton
                aria-label='close'
                onClick={handleClose}
                sx={(theme) => ({
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: theme.palette.grey[500]
                })}
              >
                <CloseIcon />
              </IconButton>
              <DialogContent dividers>
                <Box sx={{ marginBottom: 2 }}>
                  <InputLabel variant='standard' sx={{ fontWeight: 'bold', marginBottom: 0.8 }}>
                    Lý do hủy phòng:
                  </InputLabel>
                  <Select
                    fullWidth
                    size='small'
                    displayEmpty
                    defaultValue=''
                    onChange={(e) => setCancelReason(e.target.value)}
                  >
                    <MenuItem value='' disabled>
                      Chọn một trong số các lý do sau
                    </MenuItem>
                    {Object.values(CanceledReason).map((key, index) => {
                      return (
                        <MenuItem key={index} value={key}>
                          {key}
                        </MenuItem>
                      )
                    })}
                  </Select>
                  {error && <Typography color='error'>{error}</Typography>}
                </Box>
                <Box sx={{ marginBottom: 2 }}>
                  <Typography sx={{ fontWeight: 'bold', marginBottom: 0.8 }} gutterBottom>
                    Thông tin quan trọng
                  </Typography>
                  <Typography gutterBottom>
                    Xin lưu ý, sau khi hủy phòng, các khoản phí bổ sung hoặc hoàn trả sẽ được tính theo chính sách hủy
                    phòng của nơi lưu trú mà bạn đã đồng ý khi đặt phòng. Chi tiết của chính sách hủy phòng này được
                    hiển thị bên dưới. Việc hoàn tiền hoặc thu chi phí bổ sung được thực hiện trực tiếp bởi phía chi
                    nhánh, không phải từ FlexiPod.
                  </Typography>
                </Box>
                <Box sx={{ marginBottom: 2 }}>
                  <Typography sx={{ fontWeight: 'bold', marginBottom: 0.8 }} gutterBottom>
                    Miễn phí hủy phòng
                  </Typography>
                  <Typography gutterBottom>
                    Đặt phòng không có rủi ro! Quý khách có thể hủy bỏ cho đến ngày{' '}
                    {getDayBefore(orderDetail.orderDetails[0].startTime)} tháng{' '}
                    {getMonthNumber(orderDetail.orderDetails[0].startTime)}, năm 2024 và không phải trả gì! Bất kỳ việc
                    hủy phòng nào ghi nhận được sau ngày {getDayBefore(orderDetail.orderDetails[0].startTime)} tháng{' '}
                    {getMonthNumber(orderDetail.orderDetails[0].startTime)}, năm 2024 sẽ phải trả phí cho toàn bộ thời
                    gian ở. Nếu quý khách không đến hoặc hủy phòng, thì sẽ không được hoàn tiền.
                  </Typography>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} variant='outlined'>
                  Đóng
                </Button>
                <Button variant='contained' color='error' onClick={handleConfirm}>
                  Xác nhận
                </Button>
              </DialogActions>
            </BootstrapDialog>
            <BootstrapDialog onClose={handleCloseConfirm} aria-labelledby='customized-dialog-title' open={openConfirm}>
              <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold', fontSize: '1.5rem' }} id='customized-dialog-title'>
                Hủy đặt phòng
              </DialogTitle>
              <IconButton
                aria-label='close'
                onClick={handleClose}
                sx={(theme) => ({
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: theme.palette.grey[500]
                })}
              >
                <CloseIcon />
              </IconButton>
              <DialogContent dividers>
                <Box sx={{ marginBottom: 2 }}>
                  <Typography gutterBottom>Bạn có chắc chắn muốn hủy bỏ đặt phòng này không?</Typography>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseConfirm} variant='outlined'>
                  Giữ đặt phòng này
                </Button>
                <Button variant='contained' color='error' onClick={handleCancel}>
                  Xác nhận
                </Button>
              </DialogActions>
            </BootstrapDialog>
          </Box>
        </Box>
      )}
    </>
  )
}
