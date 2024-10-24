import { Box } from '@mui/material'
import Grid from '@mui/material/Grid2'
import BookingAmenityDetails from '~/components/BookingDetails/BookingAmenityDetails'
import QRCodePaymentAmenity from '~/components/QRCodePayment/QRCodePaymentAmenity'

export const PaymentAmenityDetail: React.FC = () => {
  return (
    <Box sx={{ height: '100%', marginX: '104px' }}>
      <Box>
        <Grid container>
          <Grid size={{ xs: 12, lg: 6 }} sx={{ paddingRight: '12px' }}>
            <BookingAmenityDetails />
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }} sx={{ paddingLeft: '12px' }}>
            <Box>
              <QRCodePaymentAmenity />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
