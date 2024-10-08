import { Box } from '@mui/material'
import Grid from '@mui/material/Grid2'
import BookingDetails from '~/components/BookingDetails/BookingDetails'
import QRCodePayment from '~/components/QRCodePayment/QRCodePayment'

export const PaymentDetail: React.FC = () => {
  return (
    <Box sx={{ height: '100%', marginX: '104px' }}>
      <Box>
        <Grid container>
          <Grid size={{ xs: 12, lg: 6 }} sx={{ paddingRight: '12px' }}>
            <BookingDetails />
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }} sx={{ paddingLeft: '12px' }}>
            <Box>
              <QRCodePayment />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
