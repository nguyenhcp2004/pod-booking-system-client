import { Box, Button, Grid } from '@mui/material'
import BookingDetails from '~/components/BookingDetails/BookingDetails'
import QRCodePayment from '~/components/QRCodePayment/QRCodePayment'
import { BookingProvider } from '~/contexts/BookingContext'

interface CommonProps {
  onNext: () => void
  onBack: () => void
}

export const PaymentDetail: React.FC<CommonProps> = (props) => {
  return (
    <Box sx={{ minHeight: '100%', marginX: '104px' }}>
      <BookingProvider>
        <Box>
          <Grid container>
            <Grid item xs={12} lg={6} sx={{ paddingRight: '12px' }}>
              <BookingDetails />
            </Grid>
            <Grid item xs={12} lg={6} sx={{ paddingLeft: '12px' }}>
              <QRCodePayment />
            </Grid>
          </Grid>
        </Box>
      </BookingProvider>
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
