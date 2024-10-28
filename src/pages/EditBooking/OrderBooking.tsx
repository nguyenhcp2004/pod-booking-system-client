import { Avatar, Box, Button, Divider, InputLabel, MenuItem, Select, useTheme } from '@mui/material'
import moment from 'moment'
import { OrderDetailFullInfoResType } from '~/schemaValidations/orderDetail.schema'
import { getHour } from '~/utils/utils'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Typography from '@mui/material/Typography'
import { useState } from 'react'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(3)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(2)
  }
}))
export default function OrderBooking({ orderDetail }: { orderDetail: OrderDetailFullInfoResType['data'] }) {
  const theme = useTheme()
  const priceTotalAmenities =
    orderDetail?.amenities.reduce((total, amenity) => total + amenity.price * amenity.quantity, 0) || 0
  console.log(orderDetail?.servicePackage.discountPercentage)
  const roomPrice = orderDetail?.roomPrice || 0
  const priceBeforeDiscount = roomPrice + priceTotalAmenities
  const discount = orderDetail ? orderDetail.servicePackage.discountPercentage / 100 : 0
  const priceTotal = (roomPrice + priceTotalAmenities) * (1 - discount)
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
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
                src={orderDetail.roomImage}
                alt='phong 2 nguoi'
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
                  {orderDetail?.roomName}
                </Typography>
                <Box display='flex' sx={{ marginTop: '4px' }}>
                  <Typography variant='subtitle2' color={theme.palette.primary.main}>
                    {orderDetail?.roomPrice.toLocaleString()} VND
                  </Typography>
                  <Typography variant='subtitle2'>/tiếng</Typography>
                </Box>
                <Box sx={{ marginTop: '12px' }} flexDirection='column' display='flex' gap='12px'>
                  <Box display='flex' gap='3px'>
                    <Typography variant='body2' fontWeight='bold'>
                      Địa chỉ:
                    </Typography>
                    <Typography variant='body2'>{orderDetail.buildingAddress}</Typography>
                  </Box>
                  <Box display='flex' gap='3px'>
                    <Typography variant='body2' fontWeight='bold'>
                      Ngày:
                    </Typography>
                    <Typography variant='body2'>{moment(orderDetail.startTime).format('DD-MM-YYYY')}</Typography>
                  </Box>
                  <Box display='flex' gap='3px'>
                    <Typography variant='body2' fontWeight='bold'>
                      Slot:
                    </Typography>
                    <Typography variant='body2'>
                      {getHour(orderDetail.startTime)}:00 - {getHour(orderDetail.endTime)}:00
                    </Typography>
                  </Box>
                  <Box display='flex' gap='3px'>
                    <Typography variant='body2' fontWeight='bold'>
                      Gói dịch vụ:
                    </Typography>
                    <Typography variant='body2'>{orderDetail.servicePackage.name}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box sx={{ paddingY: '20px' }}>
              {orderDetail.amenities.length > 0 && (
                <Typography variant='subtitle1' gutterBottom color={theme.palette.primary.main}>
                  Dịch vụ bạn đã chọn
                </Typography>
              )}
              {orderDetail.amenities.map((amenity, index) => {
                return (
                  <Box key={index}>
                    <Box sx={{ width: '100%' }}>
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
                            {amenity.price.toLocaleString()} VND
                          </Typography>
                        </Box>
                      </Box>
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
                {orderDetail.roomPrice.toLocaleString()} VND
              </Typography>
            </Box>
            <Box display='flex' justifyContent='space-between'>
              <Typography variant='subtitle2' color={theme.palette.grey[500]}>
                Tổng các dịch vụ:
              </Typography>
              <Typography variant='subtitle2' fontWeight='bold'>
                {priceTotalAmenities.toLocaleString()} VND
              </Typography>
            </Box>
            <Box display='flex' justifyContent='space-between'>
              <Typography variant='subtitle2' color={theme.palette.grey[500]}>
                Giảm giá: (gói {orderDetail.servicePackage.name} {orderDetail.servicePackage.discountPercentage}%)
              </Typography>
              <Typography variant='subtitle2' fontWeight='bold'>
                {(discount * priceBeforeDiscount).toLocaleString()} VND
              </Typography>
            </Box>
          </Box>
          <Divider />
          <Box sx={{ padding: '20px' }} display='flex' justifyContent='space-between'>
            <Typography variant='subtitle2' color={theme.palette.grey[500]}>
              Tổng đơn:
            </Typography>
            <Typography variant='subtitle2' fontWeight='bold'>
              {priceTotal.toLocaleString()} VND
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
                  <Select fullWidth size='small' displayEmpty defaultValue=''>
                    <MenuItem value='' disabled>
                      Chọn một trong số các lý do sau
                    </MenuItem>
                    <MenuItem value={1}>Đặt phòng không được xác nhận kịp thời</MenuItem>
                    <MenuItem value={2}>Không thật sự tin tưởng vào uy tín của dịch vụ chúng tôi</MenuItem>
                    <MenuItem value={3}>Lo lắng về sự an toàn cho vị trí phòng đặt</MenuItem>
                    <MenuItem value={4}>Quyết định chọn phòng khác không có trên FlexiPod</MenuItem>
                    <MenuItem value={5}>Không thích chính sách hủy phòng</MenuItem>
                    <MenuItem value={6}>Không hài lòng với cách thanh toán</MenuItem>
                    <MenuItem value={7}>Buộc phải hủy phòng hay hoãn lịch</MenuItem>
                    <MenuItem value={8}>Tìm thấy giá thấp hơn trên mạng</MenuItem>
                    <MenuItem value={9}>Tìm được giá thấp hơn qua dịch vụ địa phương</MenuItem>
                    <MenuItem value={10}>Sẽ đặt phòng khác trên website của chúng tôi</MenuItem>
                    <MenuItem value={11}>Sẽ đặt phòng trực tiếp với chi nhánh</MenuItem>
                    <MenuItem value={12}>Khác</MenuItem>
                  </Select>
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
                    Đặt phòng không có rủi ro! Quý khách có thể hủy bỏ cho đến 10 tháng 11, 2022 và không phải trả gì!
                    Bất kỳ việc hủy phòng nào ghi nhận được sau ngày 10 tháng 11, 2022 sẽ phải trả phí cho toàn bộ thời
                    gian ở. Nếu quý khách không đến hoặc hủy phòng, thì sẽ không được hoàn tiến.
                  </Typography>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} variant='outlined'>
                  Đóng
                </Button>
                <Button variant='contained' color='error'>
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
