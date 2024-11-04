import { Box, Button, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { tokens } from '~/themes/theme'
import ModeCommentIcon from '@mui/icons-material/ModeComment'
import { getDayAndMonthBefore, getDayBefore, getMonthNumber } from '~/utils/utils'
import { GetOrderInfoResType } from '~/schemaValidations/order.schema'
import { Link } from 'react-router-dom'

export default function Contact({ orderDetail }: { orderDetail: GetOrderInfoResType['data'] }) {
  const date = getDayAndMonthBefore(orderDetail.orderDetails[0].startTime)
  const colors = tokens('light')
  return (
    <Box
      sx={{
        bgcolor: 'white',
        padding: '20px',
        borderRadius: 2,
        boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)'
      }}
    >
      <Typography variant='h5' sx={{ color: colors.primary[500], fontWeight: '700' }}>
        Miễn phí hủy đặt phòng
      </Typography>
      <Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }} sx={{ marginBottom: 'auto', paddingTop: '1rem' }}>
            <Box>
              Để hủy miễn phí, bạn cần phải hủy <b>trước</b> ngày {getDayBefore(date.toISOString())} Tháng{' '}
              {getMonthNumber(date.toISOString())} trước 23:59 giờ. Sau thời gian này, bạn sẽ không thể hủy được nữa.
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Typography variant='h5' sx={{ color: colors.primary[500], fontWeight: '700', paddingTop: '1rem' }}>
        Có thắc mắc ?
      </Typography>
      <Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }} sx={{ marginBottom: 'auto', paddingTop: '1rem' }}>
            <Box>Liên hệ hệ thống hỗ trợ nếu bạn có thắc mắc hay yêu cầu đặc biệt nào</Box>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ width: '100%', padding: '20px' }}>
        <Link to='https://www.facebook.com/profile.php?id=61567752789181' target='_blank'>
          <Button
            startIcon={<ModeCommentIcon />}
            fullWidth
            sx={{ background: colors.primary[500], color: '#FFF', borderRadius: 'var(--12, 96px)' }}
          >
            Tin nhắn mới
          </Button>
        </Link>
      </Box>
    </Box>
  )
}
