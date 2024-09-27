import { Box, Button, Typography } from '@mui/material'

interface CommonProps {
  onNext: () => void
  onBack: () => void
}

export const PaymentDetail: React.FC<CommonProps> = (props) => {
  return (
    <Box sx={{ bgcolor: 'red', minHeight: '100%' }}>
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
