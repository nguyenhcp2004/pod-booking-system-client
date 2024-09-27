import { Box, Button, Typography } from '@mui/material'

interface CommonProps {
  onNext: () => void
  onBack: () => void
}

export 

const BookingInfo: React.FC<CommonProps> = (props) => {
  

  return (
    <Box>
      <Typography variant={'h1'}>Customer Info</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button onClick={props.onBack} sx={{ marginRight: '10px'}}>
          Quay lại
        </Button>
        <Button variant='contained' onClick={props.onNext}>
          Tiếp tục
        </Button>
      </Box>
    </Box>
  )
}


