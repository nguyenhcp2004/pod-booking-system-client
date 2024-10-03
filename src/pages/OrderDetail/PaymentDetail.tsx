import { Box, Button, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'

interface CommonProps {
  onNext: () => void
  onBack: () => void
}

export const PaymentDetail: React.FC<CommonProps> = (props) => {
  return (
    <Box sx={{ minHeight: '100%' }}>
      <Grid container>
        <Grid size={{ lg: 6 }}>{/* <OrderReceipt /> */}</Grid>
        <Grid size={{ lg: 6 }}></Grid>
      </Grid>
      <Typography variant={'h1'}>Payment</Typography>
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
