import { Box, Typography } from '@mui/material'

const order = {
  name: 'Phòng POD đôi',
  room: ['Phòng 101', 'Phòng 102'],
  price: 20000,
  address: 'Số 1, Thủ Đức, TP.HCM',
  slot: ['7h-9h', '9h-11h'],
  service: 'Gói tuần',
  date: '2021-12-12'
}

export default function OrderReceipt() {
  return (
    <Box>
      <Box>
        <Typography variant={'h5'} sx={{ fontWeight: '700' }}>
          Đơn đặt
        </Typography>
        <Box>
          <Box
            component='img'
            src='https://media.licdn.com/dms/image/D5612AQGNFj_iZIRQ6g/article-cover_image-shrink_720_1280/0/1693636697937?e=2147483647&v=beta&t=kWS-LAgE175X4GOQ6V2CKSgdm1t6fFeNXVYVyM-RE8k'
            sx={{ height: '200px', width: '200px', objectFit: 'cover' }}
          ></Box>
          <Box>
            <Typography variant={'h5'}>{order.name}</Typography>
            <Box>
              <Typography variant={'subtitle2'}>{order.price}</Typography>
              <Typography variant={'subtitle2'}>/tiếng</Typography>
            </Box>
            <Box>
              <Typography variant={'body1'}>Địa chỉ</Typography>
              <Typography variant={'body1'}>{order.address}</Typography>
            </Box>
            <Box>
              <Typography variant={'body1'}>Ngày</Typography>
              <Typography variant={'body1'}>{order.date}</Typography>
            </Box>
            <Box>
              <Typography variant={'body1'}>Slot</Typography>
              <Typography variant={'body1'}>{order.slot.join(', ')}</Typography>
            </Box>
            <Box>
              <Typography variant={'body1'}>Phòng</Typography>
              <Typography variant={'body1'}>{order.room.join(', ')}</Typography>
            </Box>
            <Box sx={{}}>
              <Typography variant={'body1'}>Gói</Typography>
              <Typography variant={'body1'}>{order.service}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
