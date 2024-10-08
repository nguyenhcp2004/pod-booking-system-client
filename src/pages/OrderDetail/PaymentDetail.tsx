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
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2, pb: 2, backgroundColor: 'white' }}>
              <Button onClick={props.onBack} sx={{ mr: 1 }}>
                Quay lại
              </Button>
            </Box>
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
