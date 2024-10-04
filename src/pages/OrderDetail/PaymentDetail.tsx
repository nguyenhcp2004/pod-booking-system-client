import { Box, Button } from '@mui/material'
import Grid from '@mui/material/Grid2'
import BookingDetails from '~/components/BookingDetails/BookingDetails'
import QRCodePayment from '~/components/QRCodePayment/QRCodePayment'

interface CommonProps {
  onNext: () => void
  onBack: () => void
}

export const PaymentDetail: React.FC<CommonProps> = (props) => {
  return (
    <Box sx={{ height: '100%', marginX: '104px' }}>
      <Box>
        <Grid container>
          <Grid size={{ xs: 12, lg: 6 }} sx={{ paddingRight: '12px' }}>
            <BookingDetails />
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }} sx={{ paddingLeft: '12px' }}>
            <QRCodePayment />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button onClick={props.onBack} sx={{ mr: 1 }}>
          Quay lại
        </Button>
        <Button variant='contained' onClick={props.onNext}>
          Tiếp tục
        </Button>
      </Box>
    </Box>
  )
}
